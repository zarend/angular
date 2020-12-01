/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {AST, TmplAstNode, TmplAstVariable} from '@angular/compiler';
import {NgCompiler} from '@angular/compiler-cli/src/ngtsc/core';
import {absoluteFrom, absoluteFromSourceFile, AbsoluteFsPath} from '@angular/compiler-cli/src/ngtsc/file_system';
import {ShimLocation, SymbolKind, TemplateTypeChecker, TypeCheckingProgramStrategy} from '@angular/compiler-cli/src/ngtsc/typecheck/api';
import * as ts from 'typescript';

import {getTargetAtPosition} from './template_target';
import {getTemplateInfoAtPosition, isWithin, TemplateInfo, toTextSpan} from './utils';

export class ReferencesAndRenameBuilder {
  private readonly ttc = this.compiler.getTemplateTypeChecker();

  constructor(
      private readonly strategy: TypeCheckingProgramStrategy,
      private readonly tsLS: ts.LanguageService, private readonly compiler: NgCompiler) {}

  findRenameLocations(filePath: AbsoluteFsPath, position: number):
      readonly ts.RenameLocation[]|undefined {
    this.ttc.generateAllTypeCheckBlocks();
    const templateInfo = getTemplateInfoAtPosition(filePath, position, this.compiler);
    if (templateInfo === undefined) {
      return this.findRenameLocationsAtTypesriptPosition(filePath, position);
    }

    const targetDetails = this.getTargetDetailsAtTemplatePosition(templateInfo, position);
    if (targetDetails === null) {
      return undefined;
    }
    return this.findRenameLocationsAtTypesriptPosition(
        targetDetails.shimPath, targetDetails.positionInShimFile);
  }

  findRenameLocationsAtTypesriptPosition(filePath: AbsoluteFsPath, position: number):
      readonly ts.RenameLocation[]|undefined {
    const refs = this.tsLS.findRenameLocations(
        filePath, position, /*findInStrings*/ false, /*findInComments*/ false);
    if (refs === undefined) {
      return undefined;
    }

    const entries: ts.RenameLocation[] = [];
    for (const ref of refs) {
      // TODO(atscott): Determine if a file is a shim file in a more robust way and make the API
      // available in an appropriate location.
      if (ref.fileName.endsWith('ngtypecheck.ts')) {
        const entry = convertToTemplateDocumentSpan(ref, this.ttc);
        if (entry !== null) {
          entries.push(entry);
        }
      } else {
        entries.push(ref);
      }
    }
    return entries;
  }

  getReferencesAtPosition(filePath: AbsoluteFsPath, position: number):
      ts.ReferenceEntry[]|undefined {
    this.ttc.generateAllTypeCheckBlocks();
    const templateInfo = getTemplateInfoAtPosition(filePath, position, this.compiler);
    if (templateInfo === undefined) {
      return this.getReferencesAtTypescriptPosition(filePath, position);
    }

    const targetDetails = this.getTargetDetailsAtTemplatePosition(templateInfo, position);
    if (targetDetails === null) {
      return undefined;
    }
    return this.getReferencesAtTypescriptPosition(
        targetDetails.shimPath, targetDetails.positionInShimFile)
  }

  private getTargetDetailsAtTemplatePosition({template, component}: TemplateInfo, position: number):
      ShimLocation&{templateTarget: TmplAstNode | AST}|null {
    // Find the AST node in the template at the position.
    const positionDetails = getTargetAtPosition(template, position);
    if (positionDetails === null) {
      return null;
    }

    // Get the information about the TCB at the template position.
    const symbol = this.ttc.getSymbolOfNode(positionDetails.node, component);
    const templateTarget = positionDetails.node;

    if (symbol === null) {
      return null;
    }
    switch (symbol.kind) {
      case SymbolKind.Element:
      case SymbolKind.Directive:
      case SymbolKind.Template:
      case SymbolKind.DomBinding:
        // References to elements, templates, and directives will be through template references
        // (#ref). They shouldn't be used directly for a Language Service reference request.
        //
        // Dom bindings aren't currently type-checked (see `checkTypeOfDomBindings`) so they don't
        // have a shim location and so we cannot find references for them.
        //
        // TODO(atscott): Consider finding references for elements that are components as well as
        // when the position is on an element attribute that directly maps to a directive.
        return null;
      case SymbolKind.Reference: {
        return {...symbol.referenceVarLocation, templateTarget};
      }
      case SymbolKind.Variable: {
        if ((templateTarget instanceof TmplAstVariable)) {
          if (templateTarget.valueSpan !== undefined &&
              isWithin(position, templateTarget.valueSpan)) {
            // In the valueSpan of the variable, we want to get the reference of the initializer.
            return {...symbol.initializerLocation, templateTarget};
          } else if (isWithin(position, templateTarget.keySpan)) {
            // In the keySpan of the variable, we want to get the reference of the local variable.
            return {...symbol.localVarLocation, templateTarget};
          } else {
            return null;
          }
        }

        // If the templateTarget is not the `TmplAstVariable`, it must be a usage of the variable
        // somewhere in the template.
        return {
          ...symbol.localVarLocation, templateTarget
        }
      }
      case SymbolKind.Input:
      case SymbolKind.Output: {
        // TODO(atscott): Determine how to handle when the binding maps to several inputs/outputs
        return {...symbol.bindings[0].shimLocation, templateTarget};
      }
      case SymbolKind.Expression: {
        return {...symbol.shimLocation, templateTarget};
      }
    }
  }

  private getReferencesAtTypescriptPosition(fileName: string, position: number):
      ts.ReferenceEntry[]|undefined {
    const refs = this.tsLS.getReferencesAtPosition(fileName, position);
    if (refs === undefined) {
      return undefined;
    }

    const entries: ts.ReferenceEntry[] = [];
    for (const ref of refs) {
      // TODO(atscott): Determine if a file is a shim file in a more robust way and make the API
      // available in an appropriate location.
      if (ref.fileName.endsWith('ngtypecheck.ts')) {
        const entry = convertToTemplateDocumentSpan(ref, this.ttc);
        if (entry !== null) {
          entries.push(entry);
        }
      } else {
        entries.push(ref);
      }
    }
    return entries;
  }
}

function convertToTemplateDocumentSpan<T extends ts.DocumentSpan>(
    shimDocumentSpan: T, templateTypeChecker: TemplateTypeChecker): T|null {
  const mapping = templateTypeChecker.getTemplateMappingAtShimLocation({
    shimPath: absoluteFrom(shimDocumentSpan.fileName),
    positionInShimFile: shimDocumentSpan.textSpan.start,
  });
  if (mapping === null) {
    return null;
  }
  const {templateSourceMapping, span} = mapping;

  let templateUrl: AbsoluteFsPath;
  if (templateSourceMapping.type === 'direct') {
    templateUrl = absoluteFromSourceFile(templateSourceMapping.node.getSourceFile());
  } else if (templateSourceMapping.type === 'external') {
    templateUrl = absoluteFrom(templateSourceMapping.templateUrl);
  } else {
    // This includes indirect mappings, which are difficult to map directly to the code location.
    // Diagnostics similarly return a synthetic template string for this case rather than a real
    // location.
    return null;
  }

  return {
    ...shimDocumentSpan,
    fileName: templateUrl,
    textSpan: toTextSpan(span),
  };
}
