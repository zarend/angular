/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {TmplAstBoundEvent} from '@angular/compiler';
import * as e from '@angular/compiler/src/expression_parser/ast';  // e for expression AST
import * as t from '@angular/compiler/src/render3/r3_ast';         // t for template AST

import {isTemplateNode, isTemplateNodeWithKeyAndValue, isWithin} from './utils';

/**
 * Contextual information for a target position within the template.
 */
export interface TemplateTarget {
  /**
   * Target position within the template.
   */
  position: number;

  /**
   * The template node (or AST expression) closest to the search position.
   */
  nodeInContext: TargetNode;

  /**
   * The `t.Template` which contains the found node or expression (or `null` if in the root
   * template).
   */
  template: t.Template|null;

  /**
   * The immediate parent node of the targeted node.
   */
  parent: t.Node|e.AST|null;
}

/**
 * A node targeted at a given position in the template, including potential contextual information
 * about the specific aspect of the node being referenced.
 *
 * Some nodes have multiple interior contexts. For example, `t.Element` nodes have both a tag name
 * as well as a body, and a given position definitively points to one or the other. `TargetNode`
 * captures the node itself, as well as this additional contextual disambiguation.
 */
export type TargetNode = RawExpression|RawTemplateNode|ElementInBodyContext|ElementInTagContext|
    AttributeInKeyContext|AttributeInValueContext;

/**
 * Differentiates the various kinds of `TargetNode`s.
 */
export enum TargetNodeKind {
  RawExpression,
  RawTemplateNode,
  ElementInTagContext,
  ElementInBodyContext,
  AttributeInKeyContext,
  AttributeInValueContext,
}

/**
 * An `e.AST` expression that's targeted at a given position, with no additional context.
 */
export interface RawExpression {
  kind: TargetNodeKind.RawExpression;
  node: e.AST;
}

/**
 * A `t.Node` template node that's targeted at a given position, with no additional context.
 */
export interface RawTemplateNode {
  kind: TargetNodeKind.RawTemplateNode;
  node: t.Node;
}

/**
 * A `t.Element` (or `t.Template`) element node that's targeted, where the given position is within
 * the tag name.
 */
export interface ElementInTagContext {
  kind: TargetNodeKind.ElementInTagContext;
  node: t.Element|t.Template;
}

/**
 * A `t.Element` (or `t.Template`) element node that's targeted, where the given position is within
 * the element body.
 */
export interface ElementInBodyContext {
  kind: TargetNodeKind.ElementInBodyContext;
  node: t.Element|t.Template;
}

export interface AttributeInKeyContext {
  kind: TargetNodeKind.AttributeInKeyContext;
  node: t.TextAttribute|t.BoundAttribute|t.BoundEvent;
}

export interface AttributeInValueContext {
  kind: TargetNodeKind.AttributeInValueContext;
  node: t.TextAttribute|t.BoundAttribute|t.BoundEvent;
}

/**
 * Return the template AST node or expression AST node that most accurately
 * represents the node at the specified cursor `position`.
 *
 * @param template AST tree of the template
 * @param position target cursor position
 */
export function getTargetAtPosition(template: t.Node[], position: number): TemplateTarget|null {
  const path = TemplateTargetVisitor.visitTemplate(template, position);
  if (path.length === 0) {
    return null;
  }

  const candidate = path[path.length - 1];
  if (isTemplateNodeWithKeyAndValue(candidate)) {
    let {keySpan, valueSpan} = candidate;
    if (valueSpan === undefined && candidate instanceof TmplAstBoundEvent) {
      valueSpan = candidate.handlerSpan;
    }
    const isWithinKeyValue =
        isWithin(position, keySpan) || (valueSpan && isWithin(position, valueSpan));
    if (!isWithinKeyValue) {
      // If cursor is within source span but not within key span or value span,
      // do not return the node.
      return null;
    }
  }

  // Walk up the result nodes to find the nearest `t.Template` which contains the targeted node.
  let context: t.Template|null = null;
  for (let i = path.length - 2; i >= 0; i--) {
    const node = path[i];
    if (node instanceof t.Template) {
      context = node;
      break;
    }
  }

  let parent: t.Node|e.AST|null = null;
  if (path.length >= 2) {
    parent = path[path.length - 2];
  }

  // Given the candidate node, determine the full targeted context.
  let nodeInContext: TargetNode;
  if (candidate instanceof e.AST) {
    nodeInContext = {
      kind: TargetNodeKind.RawExpression,
      node: candidate,
    };
  } else if (candidate instanceof t.Element) {
    // Elements have two contexts: the tag context (position is within the element tag) or the
    // element body context (position is outside of the tag name, but still in the element).

    // Calculate the end of the element tag name. Any position beyond this is in the element body.
    const tagEndPos =
        candidate.sourceSpan.start.offset + 1 /* '<' element open */ + candidate.name.length;
    if (position > tagEndPos) {
      // Position is within the element body
      nodeInContext = {
        kind: TargetNodeKind.ElementInBodyContext,
        node: candidate,
      };
    } else {
      nodeInContext = {
        kind: TargetNodeKind.ElementInTagContext,
        node: candidate,
      };
    }
  } else if (
      (candidate instanceof t.BoundAttribute || candidate instanceof t.BoundEvent ||
       candidate instanceof t.TextAttribute) &&
      candidate.keySpan !== undefined) {
    if (isWithin(position, candidate.keySpan)) {
      nodeInContext = {
        kind: TargetNodeKind.AttributeInKeyContext,
        node: candidate,
      };
    } else {
      nodeInContext = {
        kind: TargetNodeKind.AttributeInValueContext,
        node: candidate,
      };
    }
  } else {
    nodeInContext = {
      kind: TargetNodeKind.RawTemplateNode,
      node: candidate,
    };
  }

  return {position, nodeInContext, template: context, parent};
}

/**
 * Visitor which, given a position and a template, identifies the node within the template at that
 * position, as well as records the path of increasingly nested nodes that were traversed to reach
 * that position.
 */
class TemplateTargetVisitor implements t.Visitor {
  // We need to keep a path instead of the last node because we might need more
  // context for the last node, for example what is the parent node?
  readonly path: Array<t.Node|e.AST> = [];

  static visitTemplate(template: t.Node[], position: number): Array<t.Node|e.AST> {
    const visitor = new TemplateTargetVisitor(position);
    visitor.visitAll(template);
    return visitor.path;
  }

  // Position must be absolute in the source file.
  private constructor(private readonly position: number) {}

  visit(node: t.Node) {
    const last: t.Node|e.AST|undefined = this.path[this.path.length - 1];
    if (last && isTemplateNodeWithKeyAndValue(last) && isWithin(this.position, last.keySpan)) {
      // We've already identified that we are within a `keySpan` of a node.
      // We should stop processing nodes at this point to prevent matching
      // any other nodes. This can happen when the end span of a different node
      // touches the start of the keySpan for the candidate node. Because
      // our `isWithin` logic is inclusive on both ends, we can match both nodes.
      return;
    }
    const {start, end} = getSpanIncludingEndTag(node);
    if (isWithin(this.position, {start, end})) {
      this.path.push(node);
      node.visit(this);
    }
  }

  visitElement(element: t.Element) {
    this.visitAll(element.attributes);
    this.visitAll(element.inputs);
    this.visitAll(element.outputs);
    this.visitAll(element.references);
    const last: t.Node|e.AST|undefined = this.path[this.path.length - 1];
    // If we get here and have not found a candidate node on the element itself, proceed with
    // looking for a more specific node on the element children.
    if (last === element) {
      this.visitAll(element.children);
    }
  }

  visitTemplate(template: t.Template) {
    this.visitAll(template.attributes);
    this.visitAll(template.inputs);
    this.visitAll(template.outputs);
    this.visitAll(template.templateAttrs);
    this.visitAll(template.references);
    this.visitAll(template.variables);
    const last: t.Node|e.AST|undefined = this.path[this.path.length - 1];
    // If we get here and have not found a candidate node on the template itself, proceed with
    // looking for a more specific node on the template children.
    if (last === template) {
      this.visitAll(template.children);
    }
  }

  visitContent(content: t.Content) {
    t.visitAll(this, content.attributes);
  }

  visitVariable(variable: t.Variable) {
    // Variable has no template nodes or expression nodes.
  }

  visitReference(reference: t.Reference) {
    // Reference has no template nodes or expression nodes.
  }

  visitTextAttribute(attribute: t.TextAttribute) {
    // Text attribute has no template nodes or expression nodes.
  }

  visitBoundAttribute(attribute: t.BoundAttribute) {
    const visitor = new ExpressionVisitor(this.position);
    visitor.visit(attribute.value, this.path);
  }

  visitBoundEvent(event: t.BoundEvent) {
    const isTwoWayBinding =
        this.path.some(n => n instanceof t.BoundAttribute && event.name === n.name + 'Change');
    if (isTwoWayBinding) {
      // For two-way binding aka banana-in-a-box, there are two matches:
      // BoundAttribute and BoundEvent. Both have the same spans. We choose to
      // return BoundAttribute because it matches the identifier name verbatim.
      // TODO: For operations like go to definition, ideally we want to return
      // both.
      this.path.pop();  // remove bound event from the AST path
      return;
    }

    // An event binding with no value (e.g. `(event|)`) parses to a `BoundEvent` with a
    // `LiteralPrimitive` handler with value `'ERROR'`, as opposed to a property binding with no
    // value which has an `EmptyExpr` as its value. This is a synthetic node created by the binding
    // parser, and is not suitable to use for Language Service analysis. Skip it.
    //
    // TODO(alxhub): modify the parser to generate an `EmptyExpr` instead.
    let handler: e.AST = event.handler;
    if (handler instanceof e.ASTWithSource) {
      handler = handler.ast;
    }
    if (handler instanceof e.LiteralPrimitive && handler.value === 'ERROR') {
      return;
    }

    const visitor = new ExpressionVisitor(this.position);
    visitor.visit(event.handler, this.path);
  }

  visitText(text: t.Text) {
    // Text has no template nodes or expression nodes.
  }

  visitBoundText(text: t.BoundText) {
    const visitor = new ExpressionVisitor(this.position);
    visitor.visit(text.value, this.path);
  }

  visitIcu(icu: t.Icu) {
    for (const boundText of Object.values(icu.vars)) {
      this.visit(boundText);
    }
    for (const boundTextOrText of Object.values(icu.placeholders)) {
      this.visit(boundTextOrText);
    }
  }

  visitAll(nodes: t.Node[]) {
    for (const node of nodes) {
      this.visit(node);
    }
  }
}

class ExpressionVisitor extends e.RecursiveAstVisitor {
  // Position must be absolute in the source file.
  constructor(private readonly position: number) {
    super();
  }

  visit(node: e.AST, path: Array<t.Node|e.AST>) {
    if (node instanceof e.ASTWithSource) {
      // In order to reduce noise, do not include `ASTWithSource` in the path.
      // For the purpose of source spans, there is no difference between
      // `ASTWithSource` and and underlying node that it wraps.
      node = node.ast;
    }
    // The third condition is to account for the implicit receiver, which should
    // not be visited.
    if (isWithin(this.position, node.sourceSpan) && !(node instanceof e.ImplicitReceiver)) {
      path.push(node);
      node.visit(this, path);
    }
  }
}

function getSpanIncludingEndTag(ast: t.Node) {
  const result = {
    start: ast.sourceSpan.start.offset,
    end: ast.sourceSpan.end.offset,
  };
  // For Element and Template node, sourceSpan.end is the end of the opening
  // tag. For the purpose of language service, we need to actually recognize
  // the end of the closing tag. Otherwise, for situation like
  // <my-component></my-comp¦onent> where the cursor is in the closing tag
  // we will not be able to return any information.
  if ((ast instanceof t.Element || ast instanceof t.Template) && ast.endSourceSpan) {
    result.end = ast.endSourceSpan.end.offset;
  }
  return result;
}
