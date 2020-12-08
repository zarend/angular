/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CssSelector, ParseSourceFile, ParseSourceSpan, parseTemplate, R3TargetBinder, SchemaMetadata, SelectorMatcher, TmplAstElement, Type} from '@angular/compiler';
import * as ts from 'typescript';

import {absoluteFrom, AbsoluteFsPath, getSourceFileOrError, LogicalFileSystem} from '../../file_system';
import {TestFile} from '../../file_system/testing';
import {AbsoluteModuleStrategy, LocalIdentifierStrategy, LogicalProjectStrategy, ModuleResolver, Reexport, Reference, ReferenceEmitter} from '../../imports';
import {NOOP_INCREMENTAL_BUILD} from '../../incremental';
import {ClassPropertyMapping, CompoundMetadataReader} from '../../metadata';
import {ClassDeclaration, isNamedClassDeclaration, TypeScriptReflectionHost} from '../../reflection';
import {ComponentScopeReader, LocalModuleScope, ScopeData, TypeCheckScopeRegistry} from '../../scope';
import {makeProgram} from '../../testing';
import {getRootDirs} from '../../util/src/typescript';
import {ProgramTypeCheckAdapter, TemplateTypeChecker, TypeCheckContext} from '../api';
import {TemplateId, TemplateSourceMapping, TypeCheckableDirectiveMeta, TypeCheckBlockMetadata, TypeCheckingConfig, UpdateMode} from '../api/api';
import {TemplateDiagnostic} from '../diagnostics';
import {ReusedProgramStrategy} from '../src/augmented_program';
import {TemplateTypeCheckerImpl} from '../src/checker';
import {DomSchemaChecker} from '../src/dom';
import {Environment} from '../src/environment';
import {OutOfBandDiagnosticRecorder} from '../src/oob';
import {TypeCheckShimGenerator} from '../src/shim';
import {generateTypeCheckBlock} from '../src/type_check_block';

export function typescriptLibDts(): TestFile {
  return {
    name: absoluteFrom('/lib.d.ts'),
    contents: `
      type Partial<T> = { [P in keyof T]?: T[P]; };
      type Pick<T, K extends keyof T> = { [P in K]: T[P]; };
      type NonNullable<T> = T extends null | undefined ? never : T;

      // The following native type declarations are required for proper type inference
      declare interface Function {
        call(...args: any[]): any;
      }
      declare interface Array<T> {
        length: number;
      }
      declare interface String {
        length: number;
      }

      declare interface Event {
        preventDefault(): void;
      }
      declare interface MouseEvent extends Event {
        readonly x: number;
        readonly y: number;
      }

      declare interface HTMLElementEventMap {
        "click": MouseEvent;
      }
      declare interface HTMLElement {
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any): void;
        addEventListener(type: string, listener: (evt: Event): void;): void;
      }
      declare interface HTMLDivElement extends HTMLElement {}
      declare interface HTMLImageElement extends HTMLElement {
        src: string;
        alt: string;
        width: number;
        height: number;
      }
      declare interface HTMLQuoteElement extends HTMLElement {
        cite: string;
      }
      declare interface HTMLElementTagNameMap {
        "blockquote": HTMLQuoteElement;
        "div": HTMLDivElement;
        "img": HTMLImageElement;
      }
      declare interface Document {
        createElement<K extends keyof HTMLElementTagNameMap>(tagName: K): HTMLElementTagNameMap[K];
        createElement(tagName: string): HTMLElement;
      }
      declare const document: Document;
  `
  };
}

export function angularCoreDts(): TestFile {
  return {
    name: absoluteFrom('/node_modules/@angular/core/index.d.ts'),
    contents: `
    export declare class TemplateRef<C> {
      abstract readonly elementRef: unknown;
      abstract createEmbeddedView(context: C): unknown;
    }

    export declare class EventEmitter<T> {
      subscribe(generatorOrNext?: any, error?: any, complete?: any): unknown;
    }

    export declare type NgIterable<T> = Array<T> | Iterable<T>;
  `
  };
}

export function angularAnimationsDts(): TestFile {
  return {
    name: absoluteFrom('/node_modules/@angular/animations/index.d.ts'),
    contents: `
    export declare class AnimationEvent {
      element: any;
    }
  `
  };
}

export function ngForDeclaration(): TestDeclaration {
  return {
    type: 'directive',
    file: absoluteFrom('/ngfor.d.ts'),
    selector: '[ngForOf]',
    name: 'NgForOf',
    inputs: {ngForOf: 'ngForOf', ngForTrackBy: 'ngForTrackBy', ngForTemplate: 'ngForTemplate'},
    hasNgTemplateContextGuard: true,
    isGeneric: true,
  };
}

export function ngForDts(): TestFile {
  return {
    name: absoluteFrom('/ngfor.d.ts'),
    contents: `
    export declare class NgForOf<T> {
      ngForOf: T[];
      ngForTrackBy: TrackByFunction<T>;
      static ngTemplateContextGuard<T>(dir: NgForOf<T>, ctx: any): ctx is NgForOfContext<T>;
    }

    export interface TrackByFunction<T> {
      (index: number, item: T): any;
    }

    export declare class NgForOfContext<T> {
      $implicit: T;
      index: number;
      count: number;
      readonly odd: boolean;
      readonly even: boolean;
      readonly first: boolean;
      readonly last: boolean;
    }`,
  };
}

export function ngForTypeCheckTarget(): TypeCheckingTarget {
  const dts = ngForDts();
  return {
    ...dts,
    fileName: dts.name,
    source: dts.contents,
    templates: {},
  };
}

export const ALL_ENABLED_CONFIG: TypeCheckingConfig = {
  applyTemplateContextGuards: true,
  checkQueries: false,
  checkTemplateBodies: true,
  alwaysCheckSchemaInTemplateBodies: true,
  checkTypeOfInputBindings: true,
  honorAccessModifiersForInputBindings: true,
  strictNullInputBindings: true,
  checkTypeOfAttributes: true,
  // Feature is still in development.
  // TODO(alxhub): enable when DOM checking via lib.dom.d.ts is further along.
  checkTypeOfDomBindings: false,
  checkTypeOfOutputEvents: true,
  checkTypeOfAnimationEvents: true,
  checkTypeOfDomEvents: true,
  checkTypeOfDomReferences: true,
  checkTypeOfNonDomReferences: true,
  checkTypeOfPipes: true,
  strictSafeNavigationTypes: true,
  useContextGenericType: true,
  strictLiteralTypes: true,
  enableTemplateTypeChecker: false,
};

// Remove 'ref' from TypeCheckableDirectiveMeta and add a 'selector' instead.
export type TestDirective = Partial<Pick<
    TypeCheckableDirectiveMeta,
    Exclude<
        keyof TypeCheckableDirectiveMeta,
        'ref'|'coercedInputFields'|'restrictedInputFields'|'stringLiteralInputFields'|
        'undeclaredInputFields'|'inputs'|'outputs'>>>&{
  selector: string, name: string, file?: AbsoluteFsPath, type: 'directive',
      inputs?: {[fieldName: string]: string}, outputs?: {[fieldName: string]: string},
      coercedInputFields?: string[], restrictedInputFields?: string[],
      stringLiteralInputFields?: string[], undeclaredInputFields?: string[], isGeneric?: boolean;
};
export type TestPipe = {
  name: string,
  file?: AbsoluteFsPath, pipeName: string, type: 'pipe',
};

export type TestDeclaration = TestDirective|TestPipe;

export function tcb(
    template: string, declarations: TestDeclaration[] = [], config?: TypeCheckingConfig,
    options?: {emitSpans?: boolean}): string {
  const classes = ['Test', ...declarations.map(decl => decl.name)];
  const code = classes.map(name => `class ${name}<T extends string> {}`).join('\n');

  const sf = ts.createSourceFile('synthetic.ts', code, ts.ScriptTarget.Latest, true);
  const clazz = getClass(sf, 'Test');
  const templateUrl = 'synthetic.html';
  const {nodes} = parseTemplate(template, templateUrl);

  const {matcher, pipes} = prepareDeclarations(declarations, decl => getClass(sf, decl.name));
  const binder = new R3TargetBinder(matcher);
  const boundTarget = binder.bind({template: nodes});

  const id = 'tcb' as TemplateId;
  const meta: TypeCheckBlockMetadata = {id, boundTarget, pipes, schemas: []};

  config = config || {
    applyTemplateContextGuards: true,
    checkQueries: false,
    checkTypeOfInputBindings: true,
    honorAccessModifiersForInputBindings: false,
    strictNullInputBindings: true,
    checkTypeOfAttributes: true,
    checkTypeOfDomBindings: false,
    checkTypeOfOutputEvents: true,
    checkTypeOfAnimationEvents: true,
    checkTypeOfDomEvents: true,
    checkTypeOfDomReferences: true,
    checkTypeOfNonDomReferences: true,
    checkTypeOfPipes: true,
    checkTemplateBodies: true,
    alwaysCheckSchemaInTemplateBodies: true,
    strictSafeNavigationTypes: true,
    useContextGenericType: true,
    strictLiteralTypes: true,
    enableTemplateTypeChecker: false,
  };
  options = options || {
    emitSpans: false,
  };

  const tcb = generateTypeCheckBlock(
      FakeEnvironment.newFake(config), new Reference(clazz), ts.createIdentifier('Test_TCB'), meta,
      new NoopSchemaChecker(), new NoopOobRecorder());

  const removeComments = !options.emitSpans;
  const res = ts.createPrinter({removeComments}).printNode(ts.EmitHint.Unspecified, tcb, sf);
  return res.replace(/\s+/g, ' ');
}

/**
 * A file in the test program, along with any template information for components within the file.
 */
export interface TypeCheckingTarget {
  /**
   * Path to the file in the virtual test filesystem.
   */
  fileName: AbsoluteFsPath;

  /**
   * Raw source code for the file.
   *
   * If this is omitted, source code for the file will be generated based on any expected component
   * classes.
   */
  source?: string;

  /**
   * A map of component class names to string templates for that component.
   */
  templates: {[className: string]: string};

  /**
   * Any declarations (e.g. directives) which should be considered as part of the scope for the
   * components in this file.
   */
  declarations?: TestDeclaration[];
}

/**
 * Create a testing environment for template type-checking which contains a number of given test
 * targets.
 *
 * A full Angular environment is not necessary to exercise the template type-checking system.
 * Components only need to be classes which exist, with templates specified in the target
 * configuration. In many cases, it's not even necessary to include source code for test files, as
 * that can be auto-generated based on the provided target configuration.
 */
export function setup(targets: TypeCheckingTarget[], overrides: {
  config?: Partial<TypeCheckingConfig>,
  options?: ts.CompilerOptions,
  inlining?: boolean,
} = {}): {
  templateTypeChecker: TemplateTypeChecker,
  program: ts.Program,
  programStrategy: ReusedProgramStrategy,
} {
  const files = [
    typescriptLibDts(),
    angularCoreDts(),
    angularAnimationsDts(),
  ];

  for (const target of targets) {
    let contents: string;
    if (target.source !== undefined) {
      contents = target.source;
    } else {
      contents = `// generated from templates\n\nexport const MODULE = true;\n\n`;
      for (const className of Object.keys(target.templates)) {
        contents += `export class ${className} {}\n`;
      }
    }

    files.push({
      name: target.fileName,
      contents,
    });

    if (!target.fileName.endsWith('.d.ts')) {
      files.push({
        name: TypeCheckShimGenerator.shimFor(target.fileName),
        contents: 'export const MODULE = true;',
      });
    }
  }

  const opts = overrides.options ?? {};
  const config = overrides.config ?? {};

  const {program, host, options} = makeProgram(
      files, {strictNullChecks: true, noImplicitAny: true, ...opts}, /* host */ undefined,
      /* checkForErrors */ false);
  const checker = program.getTypeChecker();
  const logicalFs = new LogicalFileSystem(getRootDirs(host, options), host);
  const reflectionHost = new TypeScriptReflectionHost(checker);
  const moduleResolver =
      new ModuleResolver(program, options, host, /* moduleResolutionCache */ null);
  const emitter = new ReferenceEmitter([
    new LocalIdentifierStrategy(),
    new AbsoluteModuleStrategy(
        program, checker, moduleResolver, new TypeScriptReflectionHost(checker)),
    new LogicalProjectStrategy(reflectionHost, logicalFs),
  ]);
  const fullConfig = {...ALL_ENABLED_CONFIG, ...config};

  // Map out the scope of each target component, which is needed for the ComponentScopeReader.
  const scopeMap = new Map<ClassDeclaration, ScopeData>();
  for (const target of targets) {
    const sf = getSourceFileOrError(program, target.fileName);
    const scope = makeScope(program, sf, target.declarations ?? []);

    for (const className of Object.keys(target.templates)) {
      const classDecl = getClass(sf, className);
      scopeMap.set(classDecl, scope);
    }
  }

  const checkAdapter = createTypeCheckAdapter((sf, ctx) => {
    for (const target of targets) {
      if (getSourceFileOrError(program, target.fileName) !== sf) {
        continue;
      }

      const declarations = target.declarations ?? [];

      for (const className of Object.keys(target.templates)) {
        const classDecl = getClass(sf, className);
        const template = target.templates[className];
        const templateUrl = `${className}.html`;
        const templateFile = new ParseSourceFile(template, templateUrl);
        const {nodes, errors} = parseTemplate(template, templateUrl);
        if (errors !== null) {
          throw new Error('Template parse errors: \n' + errors.join('\n'));
        }

        const {matcher, pipes} = prepareDeclarations(declarations, decl => {
          let declFile = sf;
          if (decl.file !== undefined) {
            declFile = program.getSourceFile(decl.file)!;
            if (declFile === undefined) {
              throw new Error(`Unable to locate ${decl.file} for ${decl.type} ${decl.name}`);
            }
          }
          return getClass(declFile, decl.name);
        });
        const binder = new R3TargetBinder(matcher);
        const classRef = new Reference(classDecl);

        const sourceMapping: TemplateSourceMapping = {
          type: 'external',
          template,
          templateUrl,
          componentClass: classRef.node,
          // Use the class's name for error mappings.
          node: classRef.node.name,
        };

        ctx.addTemplate(classRef, binder, nodes, pipes, [], sourceMapping, templateFile, errors);
      }
    }
  });

  const programStrategy = new ReusedProgramStrategy(program, host, options, ['ngtypecheck']);
  if (overrides.inlining !== undefined) {
    (programStrategy as any).supportsInlineOperations = overrides.inlining;
  }

  const fakeScopeReader: ComponentScopeReader = {
    getRemoteScope(): null {
      return null;
    },
    // If there is a module with [className] + 'Module' in the same source file, that will be
    // returned as the NgModule for the class.
    getScopeForComponent(clazz: ClassDeclaration): LocalModuleScope |
        null {
          try {
            const ngModule = getClass(clazz.getSourceFile(), `${clazz.name.getText()}Module`);

            if (!scopeMap.has(clazz)) {
              // This class wasn't part of the target set of components with templates, but is
              // probably a declaration used in one of them. Return an empty scope.
              const emptyScope: ScopeData = {
                directives: [],
                ngModules: [],
                pipes: [],
                isPoisoned: false,
              };
              return {
                ngModule,
                compilation: emptyScope,
                reexports: [],
                schemas: [],
                exported: emptyScope,
              };
            }
            const scope = scopeMap.get(clazz)!;

            return {
              ngModule,
              compilation: scope,
              reexports: [],
              schemas: [],
              exported: scope,
            };
          } catch (e) {
            // No NgModule was found for this class, so it has no scope.
            return null;
          }
        }
  };

  const typeCheckScopeRegistry =
      new TypeCheckScopeRegistry(fakeScopeReader, new CompoundMetadataReader([]));

  const templateTypeChecker = new TemplateTypeCheckerImpl(
      program, programStrategy, checkAdapter, fullConfig, emitter, reflectionHost, host,
      NOOP_INCREMENTAL_BUILD, fakeScopeReader, typeCheckScopeRegistry);
  return {
    templateTypeChecker,
    program,
    programStrategy,
  };
}

function createTypeCheckAdapter(fn: (sf: ts.SourceFile, ctx: TypeCheckContext) => void):
    ProgramTypeCheckAdapter {
  return {typeCheck: fn};
}

function prepareDeclarations(
    declarations: TestDeclaration[],
    resolveDeclaration: (decl: TestDeclaration) => ClassDeclaration<ts.ClassDeclaration>) {
  const matcher = new SelectorMatcher();
  for (const decl of declarations) {
    if (decl.type !== 'directive') {
      continue;
    }

    const selector = CssSelector.parse(decl.selector);
    const meta: TypeCheckableDirectiveMeta = {
      name: decl.name,
      ref: new Reference(resolveDeclaration(decl)),
      exportAs: decl.exportAs || null,
      selector: decl.selector || null,
      hasNgTemplateContextGuard: decl.hasNgTemplateContextGuard || false,
      inputs: ClassPropertyMapping.fromMappedObject(decl.inputs || {}),
      isComponent: decl.isComponent || false,
      ngTemplateGuards: decl.ngTemplateGuards || [],
      coercedInputFields: new Set<string>(decl.coercedInputFields || []),
      restrictedInputFields: new Set<string>(decl.restrictedInputFields || []),
      stringLiteralInputFields: new Set<string>(decl.stringLiteralInputFields || []),
      undeclaredInputFields: new Set<string>(decl.undeclaredInputFields || []),
      isGeneric: decl.isGeneric ?? false,
      outputs: ClassPropertyMapping.fromMappedObject(decl.outputs || {}),
      queries: decl.queries || [],
      isStructural: false,
    };
    matcher.addSelectables(selector, meta);
  }

  const pipes = new Map<string, Reference<ClassDeclaration<ts.ClassDeclaration>>>();
  for (const decl of declarations) {
    if (decl.type === 'pipe') {
      pipes.set(decl.pipeName, new Reference(resolveDeclaration(decl)));
    }
  }

  return {matcher, pipes};
}

export function getClass(sf: ts.SourceFile, name: string): ClassDeclaration<ts.ClassDeclaration> {
  for (const stmt of sf.statements) {
    if (isNamedClassDeclaration(stmt) && stmt.name.text === name) {
      return stmt;
    }
  }
  throw new Error(`Class ${name} not found in file: ${sf.fileName}: ${sf.text}`);
}

/**
 * Synthesize `ScopeData` metadata from an array of `TestDeclaration`s.
 */
function makeScope(program: ts.Program, sf: ts.SourceFile, decls: TestDeclaration[]): ScopeData {
  const scope: ScopeData = {
    ngModules: [],
    directives: [],
    pipes: [],
    isPoisoned: false,
  };

  for (const decl of decls) {
    let declSf = sf;
    if (decl.file !== undefined) {
      declSf = getSourceFileOrError(program, decl.file);
    }
    const declClass = getClass(declSf, decl.name);

    if (decl.type === 'directive') {
      scope.directives.push({
        ref: new Reference(declClass),
        baseClass: null,
        name: decl.name,
        selector: decl.selector,
        queries: [],
        inputs: decl.inputs !== undefined ? ClassPropertyMapping.fromMappedObject(decl.inputs) :
                                            ClassPropertyMapping.empty(),
        outputs: decl.outputs !== undefined ? ClassPropertyMapping.fromMappedObject(decl.outputs) :
                                              ClassPropertyMapping.empty(),
        isComponent: decl.isComponent ?? false,
        exportAs: decl.exportAs ?? null,
        ngTemplateGuards: decl.ngTemplateGuards ?? [],
        hasNgTemplateContextGuard: decl.hasNgTemplateContextGuard ?? false,
        coercedInputFields: new Set(decl.coercedInputFields ?? []),
        restrictedInputFields: new Set(decl.restrictedInputFields ?? []),
        stringLiteralInputFields: new Set(decl.stringLiteralInputFields ?? []),
        undeclaredInputFields: new Set(decl.undeclaredInputFields ?? []),
        isGeneric: decl.isGeneric ?? false,
        isPoisoned: false,
        isStructural: false,
      });
    } else if (decl.type === 'pipe') {
      scope.pipes.push({
        ref: new Reference(declClass),
        name: decl.pipeName,
      });
    }
  }

  return scope;
}

class FakeEnvironment /* implements Environment */ {
  constructor(readonly config: TypeCheckingConfig) {}

  typeCtorFor(dir: TypeCheckableDirectiveMeta): ts.Expression {
    return ts.createPropertyAccess(ts.createIdentifier(dir.name), 'ngTypeCtor');
  }

  pipeInst(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>): ts.Expression {
    return ts.createParen(ts.createAsExpression(ts.createNull(), this.referenceType(ref)));
  }

  declareOutputHelper(): ts.Expression {
    return ts.createIdentifier('_outputHelper');
  }

  reference(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>): ts.Expression {
    return ref.node.name;
  }

  referenceType(ref: Reference<ClassDeclaration<ts.ClassDeclaration>>): ts.TypeNode {
    return ts.createTypeReferenceNode(ref.node.name, /* typeArguments */ undefined);
  }

  referenceExternalType(moduleName: string, name: string, typeParams?: Type[]): ts.TypeNode {
    const typeArgs: ts.TypeNode[] = [];
    if (typeParams !== undefined) {
      for (let i = 0; i < typeParams.length; i++) {
        typeArgs.push(ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
      }
    }

    const ns = ts.createIdentifier(moduleName.replace('@angular/', ''));
    const qName = ts.createQualifiedName(ns, name);
    return ts.createTypeReferenceNode(qName, typeArgs.length > 0 ? typeArgs : undefined);
  }

  getPreludeStatements(): ts.Statement[] {
    return [];
  }

  static newFake(config: TypeCheckingConfig): Environment {
    return new FakeEnvironment(config) as Environment;
  }
}

export class NoopSchemaChecker implements DomSchemaChecker {
  get diagnostics(): ReadonlyArray<TemplateDiagnostic> {
    return [];
  }

  checkElement(id: string, element: TmplAstElement, schemas: SchemaMetadata[]): void {}
  checkProperty(
      id: string, element: TmplAstElement, name: string, span: ParseSourceSpan,
      schemas: SchemaMetadata[]): void {}
}

export class NoopOobRecorder implements OutOfBandDiagnosticRecorder {
  get diagnostics(): ReadonlyArray<TemplateDiagnostic> {
    return [];
  }
  missingReferenceTarget(): void {}
  missingPipe(): void {}
  illegalAssignmentToTemplateVar(): void {}
  duplicateTemplateVar(): void {}
  requiresInlineTcb(): void {}
  requiresInlineTypeConstructors(): void {}
}
