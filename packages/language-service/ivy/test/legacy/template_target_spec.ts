/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ParseError, parseTemplate} from '@angular/compiler';
import * as e from '@angular/compiler/src/expression_parser/ast';  // e for expression AST
import * as t from '@angular/compiler/src/render3/r3_ast';         // t for template AST

import {getTargetAtPosition} from '../../template_target';
import {isExpressionNode, isTemplateNode} from '../../utils';

interface ParseResult {
  nodes: t.Node[];
  errors: ParseError[]|null;
  position: number;
}

function parse(template: string): ParseResult {
  const position = template.indexOf('¦');
  if (position < 0) {
    throw new Error(`Template "${template}" does not contain the cursor`);
  }
  template = template.replace('¦', '');
  const templateUrl = '/foo';
  return {
    ...parseTemplate(template, templateUrl),
    position,
  };
}

describe('getTargetAtPosition for template AST', () => {
  it('should locate element in opening tag', () => {
    const {errors, nodes, position} = parse(`<di¦v></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
  });

  it('should locate element in closing tag', () => {
    const {errors, nodes, position} = parse(`<div></di¦v>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
  });

  it('should locate element when cursor is at the beginning', () => {
    const {errors, nodes, position} = parse(`<¦div></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
  });

  it('should locate element when cursor is at the end', () => {
    const {errors, nodes, position} = parse(`<div¦></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
  });

  it('should locate attribute key', () => {
    const {errors, nodes, position} = parse(`<div cla¦ss="foo"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate attribute value', () => {
    const {errors, nodes, position} = parse(`<div class="fo¦o"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    // TODO: Note that we do not have the ability to detect the RHS (yet)
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate bound attribute key', () => {
    const {errors, nodes, position} = parse(`<test-cmp [fo¦o]="bar"></test-cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
  });

  it('should locate bound attribute value', () => {
    const {errors, nodes, position} = parse(`<test-cmp [foo]="b¦ar"></test-cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
  });

  it('should not locate bound attribute if cursor is between key and value', () => {
    const {errors, nodes, position} = parse(`<test-cmp [foo]¦="bar"></test-cmp>`);
    expect(errors).toBeNull();
    const nodeInfo = getTargetAtPosition(nodes, position)!;
    expect(nodeInfo).toBeNull();
  });

  it('should locate bound event key', () => {
    const {errors, nodes, position} = parse(`<test-cmp (fo¦o)="bar()"></test-cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundEvent);
  });

  it('should locate bound event value', () => {
    const {errors, nodes, position} = parse(`<test-cmp (foo)="b¦ar()"></test-cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.MethodCall);
  });

  it('should locate element children', () => {
    const {errors, nodes, position} = parse(`<div><sp¦an></span></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
    expect((node as t.Element).name).toBe('span');
  });

  it('should locate element reference', () => {
    const {errors, nodes, position} = parse(`<div #my¦div></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Reference);
  });

  it('should locate template text attribute', () => {
    const {errors, nodes, position} = parse(`<ng-template ng¦If></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate template bound attribute key', () => {
    const {errors, nodes, position} = parse(`<ng-template [ng¦If]="foo"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
  });

  it('should locate template bound attribute value', () => {
    const {errors, nodes, position} = parse(`<ng-template [ngIf]="f¦oo"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
  });

  it('should locate template bound attribute key in two-way binding', () => {
    const {errors, nodes, position} = parse(`<ng-template [(f¦oo)]="bar"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('foo');
  });

  it('should locate template bound attribute value in two-way binding', () => {
    const {errors, nodes, position} = parse(`<ng-template [(foo)]="b¦ar"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('bar');
  });

  it('should locate template bound event key', () => {
    const {errors, nodes, position} = parse(`<ng-template (cl¦ick)="foo()"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundEvent);
  });

  it('should locate template bound event value', () => {
    const {errors, nodes, position} = parse(`<ng-template (click)="f¦oo()"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(node).toBeInstanceOf(e.MethodCall);
  });

  it('should locate template attribute key', () => {
    const {errors, nodes, position} = parse(`<ng-template i¦d="foo"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate template attribute value', () => {
    const {errors, nodes, position} = parse(`<ng-template id="f¦oo"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    // TODO: Note that we do not have the ability to detect the RHS (yet)
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate template reference key via the # notation', () => {
    const {errors, nodes, position} = parse(`<ng-template #f¦oo></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Reference);
    expect((node as t.Reference).name).toBe('foo');
  });

  it('should locate template reference key via the ref- notation', () => {
    const {errors, nodes, position} = parse(`<ng-template ref-fo¦o></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Reference);
    expect((node as t.Reference).name).toBe('foo');
  });

  it('should locate template reference value via the # notation', () => {
    const {errors, nodes, position} = parse(`<ng-template #foo="export¦As"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Reference);
    expect((node as t.Reference).value).toBe('exportAs');
    // TODO: Note that we do not have the ability to distinguish LHS and RHS
  });

  it('should locate template reference value via the ref- notation', () => {
    const {errors, nodes, position} = parse(`<ng-template ref-foo="export¦As"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Reference);
    expect((node as t.Reference).value).toBe('exportAs');
    // TODO: Note that we do not have the ability to distinguish LHS and RHS
  });

  it('should locate template variable key', () => {
    const {errors, nodes, position} = parse(`<ng-template let-f¦oo="bar"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Variable);
  });

  it('should locate template variable value', () => {
    const {errors, nodes, position} = parse(`<ng-template let-foo="b¦ar"></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Variable);
  });

  it('should locate template children', () => {
    const {errors, nodes, position} = parse(`<ng-template><d¦iv></div></ng-template>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
  });

  it('should locate ng-content', () => {
    const {errors, nodes, position} = parse(`<ng-co¦ntent></ng-content>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Content);
  });

  it('should locate ng-content attribute key', () => {
    const {errors, nodes, position} = parse('<ng-content cla¦ss="red"></ng-content>');
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should locate ng-content attribute value', () => {
    const {errors, nodes, position} = parse('<ng-content class="r¦ed"></ng-content>');
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    // TODO: Note that we do not have the ability to detect the RHS (yet)
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.TextAttribute);
  });

  it('should not locate implicit receiver', () => {
    const {errors, nodes, position} = parse(`<div [foo]="¦bar"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
  });

  it('should locate bound attribute key in two-way binding', () => {
    const {errors, nodes, position} = parse(`<cmp [(f¦oo)]="bar"></cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('foo');
  });

  it('should locate bound attribute value in two-way binding', () => {
    const {errors, nodes, position} = parse(`<cmp [(foo)]="b¦ar"></cmp>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('bar');
  });

  it('should locate switch value in ICUs', () => {
    const {errors, nodes, position} = parse(`<span i18n>{sw¦itch, plural, other {text}}"></span>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('switch');
  });

  it('should locate switch value in nested ICUs', () => {
    const {errors, nodes, position} = parse(
        `<span i18n>{expr, plural, other { {ne¦sted, plural, =1 { {{nestedInterpolation}} }} }}"></span>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('nested');
  });

  it('should locate interpolation expressions in ICUs', () => {
    const {errors, nodes, position} =
        parse(`<span i18n>{expr, plural, other { {{ i¦nterpolation }} }}"></span>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('interpolation');
  });

  it('should locate interpolation expressions in nested ICUs', () => {
    const {errors, nodes, position} = parse(
        `<span i18n>{expr, plural, other { {nested, plural, =1 { {{n¦estedInterpolation}} }} }}"></span>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('nestedInterpolation');
  });
});

describe('getTargetAtPosition for expression AST', () => {
  it('should not locate implicit receiver', () => {
    const {errors, nodes, position} = parse(`{{ ¦title }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('title');
  });

  it('should locate property read', () => {
    const {errors, nodes, position} = parse(`{{ ti¦tle }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('title');
  });

  it('should locate safe property read', () => {
    const {errors, nodes, position} = parse(`{{ foo?¦.bar }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.SafePropertyRead);
    expect((node as e.SafePropertyRead).name).toBe('bar');
  });

  it('should locate keyed read', () => {
    const {errors, nodes, position} = parse(`{{ foo['bar']¦ }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.KeyedRead);
  });

  it('should locate property write', () => {
    const {errors, nodes, position} = parse(`<div (foo)="b¦ar=$event"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyWrite);
  });

  it('should locate keyed write', () => {
    const {errors, nodes, position} = parse(`<div (foo)="bar['baz']¦=$event"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.KeyedWrite);
  });

  it('should locate binary', () => {
    const {errors, nodes, position} = parse(`{{ 1 +¦ 2 }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.Binary);
  });

  it('should locate binding pipe with an identifier', () => {
    const {errors, nodes, position} = parse(`{{ title | p¦ }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.BindingPipe);
  });

  it('should locate binding pipe without identifier', () => {
    const {errors, nodes, position} = parse(`{{ title | ¦ }}`);
    expect(errors?.length).toBe(1);
    expect(errors![0].toString())
        .toContain(
            'Unexpected end of input, expected identifier or keyword at the end of the expression');
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    // TODO: We want this to be a BindingPipe.
    expect(node).toBeInstanceOf(e.Interpolation);
  });

  it('should locate binding pipe without identifier',
     () => {
         // TODO: We are not able to locate pipe if identifier is missing because the
         // parser throws an error. This case is important for autocomplete.
         // const {errors, nodes, position} = parse(`{{ title | ¦ }}`);
         // expect(errors).toBe(null);
         // const {nodeInContext} = findNodeAtPosition(nodes, position)!;
         // expect(isExpressionNode(node!)).toBe(true);
         // expect(node).toBeInstanceOf(e.BindingPipe);
     });


  it('should locate method call', () => {
    const {errors, nodes, position} = parse(`{{ title.toString(¦) }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.MethodCall);
  });

  it('should locate safe method call', () => {
    const {errors, nodes, position} = parse(`{{ title?.toString(¦) }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.SafeMethodCall);
  });

  it('should locate literal primitive in interpolation', () => {
    const {errors, nodes, position} = parse(`{{ title.indexOf('t¦') }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.LiteralPrimitive);
    expect((node as e.LiteralPrimitive).value).toBe('t');
  });

  it('should locate literal primitive in binding', () => {
    const {errors, nodes, position} = parse(`<div [id]="'t¦'"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.LiteralPrimitive);
    expect((node as e.LiteralPrimitive).value).toBe('t');
  });

  it('should locate empty expression', () => {
    const {errors, nodes, position} = parse(`<div [id]="¦"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.EmptyExpr);
  });

  it('should locate literal array', () => {
    const {errors, nodes, position} = parse(`{{ [1, 2,¦ 3] }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.LiteralArray);
  });

  it('should locate literal map', () => {
    const {errors, nodes, position} = parse(`{{ { hello:¦ "world" } }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.LiteralMap);
  });

  it('should locate conditional', () => {
    const {errors, nodes, position} = parse(`{{ cond ?¦ true : false }}`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.Conditional);
  });
});

describe('findNodeAtPosition for microsyntax expression', () => {
  it('should locate template key', () => {
    const {errors, nodes, position} = parse(`<div *ng¦If="foo"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
  });

  it('should locate template value', () => {
    const {errors, nodes, position} = parse(`<div *ngIf="f¦oo"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
  });

  it('should locate text attribute', () => {
    const {errors, nodes, position} = parse(`<div *ng¦For="let item of items"></div>`);
    // ngFor is a text attribute because the desugared form is
    // <ng-template ngFor let-item [ngForOf]="items">
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBeTrue();
    expect(node).toBeInstanceOf(t.TextAttribute);
    expect((node as t.TextAttribute).name).toBe('ngFor');
  });

  it('should not locate let keyword', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="l¦et item of items"></div>`);
    expect(errors).toBeNull();
    const target = getTargetAtPosition(nodes, position)!;
    expect(target).toBeNull();
  });

  it('should locate let variable', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let i¦tem of items"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Variable);
    expect((node as t.Variable).name).toBe('item');
  });

  it('should locate bound attribute key', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let item o¦f items"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('ngForOf');
  });

  it('should locate bound attribute key when cursor is at the start', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let item ¦of items"></div>`);
    expect(errors).toBe(null);
    const {node} = getTargetAtPosition(nodes, position)!;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('ngForOf');
  });

  it('should locate bound attribute key for trackBy', () => {
    const {errors, nodes, position} =
        parse(`<div *ngFor="let item of items; trac¦kBy: trackByFn"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('ngForTrackBy');
  });

  it('should locate first bound attribute when there are two', () => {
    // It used to be the case that all microsyntax bindings share the same
    // source span, so the second bound attribute would overwrite the first.
    // This has been fixed in pr/39036, this case is added to prevent regression.
    const {errors, nodes, position} =
        parse(`<div *ngFor="let item o¦f items; trackBy: trackByFn"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.BoundAttribute);
    expect((node as t.BoundAttribute).name).toBe('ngForOf');
  });

  it('should locate bound attribute value', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let item of it¦ems"></div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
    expect((node as e.PropertyRead).name).toBe('items');
  });

  it('should locate template children', () => {
    const {errors, nodes, position} = parse(`<di¦v *ngIf></div>`);
    expect(errors).toBe(null);
    const {nodeInContext, template: context} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Element);
    expect((node as t.Element).name).toBe('div');
    expect(context).toBeInstanceOf(t.Template);
  });

  it('should locate property read of variable declared within template', () => {
    const {errors, nodes, position} = parse(`
      <div *ngFor="let item of items; let i=index">
        {{ i¦ }}
      </div>`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isExpressionNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(e.PropertyRead);
  });

  it('should locate LHS of variable declaration', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let item of items; let i¦=index">`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Variable);
    // TODO: Currently there is no way to distinguish LHS from RHS
    expect((node as t.Variable).name).toBe('i');
  });

  it('should locate RHS of variable declaration', () => {
    const {errors, nodes, position} = parse(`<div *ngFor="let item of items; let i=in¦dex">`);
    expect(errors).toBe(null);
    const {nodeInContext} = getTargetAtPosition(nodes, position)!;
    const {node} = nodeInContext;
    expect(isTemplateNode(node!)).toBe(true);
    expect(node).toBeInstanceOf(t.Variable);
    // TODO: Currently there is no way to distinguish LHS from RHS
    expect((node as t.Variable).value).toBe('index');
  });
});
