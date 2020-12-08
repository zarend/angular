/****************************************************************************************************
 * PARTIAL FILE: nested_template_context.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.component = this;
    }
    format(outer, middle, inner) { }
    onClick(outer, middle, inner) { }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <ul *ngFor="let outer of items">
      <li *ngFor="let middle of outer.items">
        <div *ngFor="let inner of items"
             (click)="onClick(outer, middle, inner)"
             [title]="format(outer, middle, inner, component)"
             >
          {{format(outer, middle, inner, component)}}
        </div>
      </li>
    </ul>`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <ul *ngFor="let outer of items">
      <li *ngFor="let middle of outer.items">
        <div *ngFor="let inner of items"
             (click)="onClick(outer, middle, inner)"
             [title]="format(outer, middle, inner, component)"
             >
          {{format(outer, middle, inner, component)}}
        </div>
      </li>
    </ul>`
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: nested_template_context.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    component: this;
    format(outer: any, middle: any, inner: any): void;
    onClick(outer: any, middle: any, inner: any): void;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: nested_template_context_many_bindings.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this._data = [1, 2, 3];
    }
    _handleClick(d, i) { }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div *ngFor="let d of _data; let i = index" (click)="_handleClick(d, i)"></div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div *ngFor="let d of _data; let i = index" (click)="_handleClick(d, i)"></div>
  `
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: nested_template_context_many_bindings.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    _data: number[];
    _handleClick(d: any, i: any): void;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: implicit_receiver.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    greet(val) { }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div *ngIf="true" (click)="greet(this)"></div>
    <div *ngIf="true" [id]="this"></div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div *ngIf="true" (click)="greet(this)"></div>
    <div *ngIf="true" [id]="this"></div>
  `
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: implicit_receiver.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    greet(val: any): void;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_for_context_variables.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <span *ngFor="let item of items; index as i">
      {{ i }} - {{ item }}
    </span>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <span *ngFor="let item of items; index as i">
      {{ i }} - {{ item }}
    </span>
  `
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_for_context_variables.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_for_parent_context_variables.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div *ngFor="let item of items; index as i">
        <span *ngIf="showing">
          {{ i }} - {{ item }}
        </span>
    </div>`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div *ngFor="let item of items; index as i">
        <span *ngIf="showing">
          {{ i }} - {{ item }}
        </span>
    </div>`
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_for_parent_context_variables.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: template_context_skip.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div *ngFor="let outer of items">
      <div *ngFor="let middle of outer.items">
        <div *ngFor="let inner of middle.items">
          {{ middle.value }} - {{ name }}
        </div>
      </div>
    </div>`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div *ngFor="let outer of items">
      <div *ngFor="let middle of outer.items">
        <div *ngFor="let inner of middle.items">
          {{ middle.value }} - {{ name }}
        </div>
      </div>
    </div>`
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: template_context_skip.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_template.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <ng-template [boundAttr]="b" attr="l">
      some-content
    </ng-template>`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <ng-template [boundAttr]="b" attr="l">
      some-content
    </ng-template>`
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_template.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_template_local_ref.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: '<ng-template #foo>some-content</ng-template>', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: '<ng-template #foo>some-content</ng-template>',
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_template_local_ref.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_template_output.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: '<ng-template (outDirective)="$event.doSth()"></ng-template>', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: '<ng-template (outDirective)="$event.doSth()"></ng-template>',
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_template_output.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_template_interpolated_prop.js
 ****************************************************************************************************/
import { Component, Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
class WithInput {
    constructor() {
        this.dir = '';
    }
}
WithInput.ɵfac = function WithInput_Factory(t) { return new (t || WithInput)(); };
WithInput.ɵdir = i0.ɵɵngDeclareDirective({ version: "0.0.0-PLACEHOLDER", type: WithInput, selector: "[dir]", inputs: { dir: "dir" }, ngImport: i0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(WithInput, [{
        type: Directive,
        args: [{ selector: '[dir]' }]
    }], null, { dir: [{
            type: Input
        }] }); })();
export class TestComp {
    constructor() {
        this.message = 'Hello';
    }
}
TestComp.ɵfac = function TestComp_Factory(t) { return new (t || TestComp)(); };
TestComp.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: TestComp, selector: "my-app", ngImport: i0, template: { source: '<ng-template dir="{{ message }}"></ng-template>', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TestComp, [{
        type: Component,
        args: [{
                selector: 'my-app',
                template: '<ng-template dir="{{ message }}"></ng-template>',
            }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_template_interpolated_prop.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class TestComp {
    message: string;
    static ɵfac: i0.ɵɵFactoryDef<TestComp, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<TestComp, "my-app", never, {}, {}, never, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: ng_template_interpolated_prop_with_structural_directive.js
 ****************************************************************************************************/
import { Component, Directive, Input } from '@angular/core';
import * as i0 from "@angular/core";
class WithInput {
    constructor() {
        this.dir = '';
    }
}
WithInput.ɵfac = function WithInput_Factory(t) { return new (t || WithInput)(); };
WithInput.ɵdir = i0.ɵɵngDeclareDirective({ version: "0.0.0-PLACEHOLDER", type: WithInput, selector: "[dir]", inputs: { dir: "dir" }, ngImport: i0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(WithInput, [{
        type: Directive,
        args: [{ selector: '[dir]' }]
    }], null, { dir: [{
            type: Input
        }] }); })();
export class TestComp {
    constructor() {
        this.message = 'Hello';
    }
}
TestComp.ɵfac = function TestComp_Factory(t) { return new (t || TestComp)(); };
TestComp.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: TestComp, selector: "my-app", ngImport: i0, template: { source: '<ng-template *ngIf="true" dir="{{ message }}"></ng-template>', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(TestComp, [{
        type: Component,
        args: [{
                selector: 'my-app',
                template: '<ng-template *ngIf="true" dir="{{ message }}"></ng-template>',
            }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: ng_template_interpolated_prop_with_structural_directive.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class TestComp {
    message: string;
    static ɵfac: i0.ɵɵFactoryDef<TestComp, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<TestComp, "my-app", never, {}, {}, never, never>;
}

/****************************************************************************************************
 * PARTIAL FILE: unique_template_function_names.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class AComponent {
    constructor() {
        this.items = [4, 2];
    }
}
AComponent.ɵfac = function AComponent_Factory(t) { return new (t || AComponent)(); };
AComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: AComponent, selector: "a-component", ngImport: i0, template: { source: `
    <div *ngFor="let item of items">
      <p *ngIf="item < 10">less than 10</p>
      <p *ngIf="item < 10">less than 10</p>
    </div>
    <div *ngFor="let item of items">
      <p *ngIf="item > 10">more than 10</p>
    </div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AComponent, [{
        type: Component,
        args: [{
                selector: 'a-component',
                template: `
    <div *ngFor="let item of items">
      <p *ngIf="item < 10">less than 10</p>
      <p *ngIf="item < 10">less than 10</p>
    </div>
    <div *ngFor="let item of items">
      <p *ngIf="item > 10">more than 10</p>
    </div>
  `,
            }]
    }], null, null); })();
export class AModule {
}
AModule.ɵmod = i0.ɵɵdefineNgModule({ type: AModule });
AModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AModule_Factory(t) { return new (t || AModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AModule, { declarations: [AComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AModule, [{
        type: NgModule,
        args: [{ declarations: [AComponent] }]
    }], null, null); })();
export class BComponent {
    constructor() {
        this.items = [
            { subitems: [1, 3] },
            { subitems: [3, 7] },
        ];
    }
}
BComponent.ɵfac = function BComponent_Factory(t) { return new (t || BComponent)(); };
BComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: BComponent, selector: "b-component", ngImport: i0, template: { source: `
    <div *ngFor="let item of items">
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem < 10">less than 10</p>
        <p *ngIf="subitem < 10">less than 10</p>
      </ng-container>
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem < 10">less than 10</p>
      </ng-container>
    </div>
    <div *ngFor="let item of items">
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem > 10">more than 10</p>
      </ng-container>
    </div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BComponent, [{
        type: Component,
        args: [{
                selector: 'b-component',
                template: `
    <div *ngFor="let item of items">
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem < 10">less than 10</p>
        <p *ngIf="subitem < 10">less than 10</p>
      </ng-container>
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem < 10">less than 10</p>
      </ng-container>
    </div>
    <div *ngFor="let item of items">
      <ng-container *ngFor="let subitem of item.subitems">
        <p *ngIf="subitem > 10">more than 10</p>
      </ng-container>
    </div>
  `,
            }]
    }], null, null); })();
export class BModule {
}
BModule.ɵmod = i0.ɵɵdefineNgModule({ type: BModule });
BModule.ɵinj = i0.ɵɵdefineInjector({ factory: function BModule_Factory(t) { return new (t || BModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(BModule, { declarations: [BComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BModule, [{
        type: NgModule,
        args: [{ declarations: [BComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: unique_template_function_names.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class AComponent {
    items: number[];
    static ɵfac: i0.ɵɵFactoryDef<AComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<AComponent, "a-component", never, {}, {}, never, never>;
}
export declare class AModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AModule, [typeof AComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<AModule>;
}
export declare class BComponent {
    items: {
        subitems: number[];
    }[];
    static ɵfac: i0.ɵɵFactoryDef<BComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BComponent, "b-component", never, {}, {}, never, never>;
}
export declare class BModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<BModule, [typeof BComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<BModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: unique_template_function_names_ng_content.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class AComponent {
    constructor() {
        this.show = true;
    }
}
AComponent.ɵfac = function AComponent_Factory(t) { return new (t || AComponent)(); };
AComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: AComponent, selector: "a-component", ngImport: i0, template: { source: `
    <ng-content *ngIf="show"></ng-content>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AComponent, [{
        type: Component,
        args: [{
                selector: 'a-component',
                template: `
    <ng-content *ngIf="show"></ng-content>
  `,
            }]
    }], null, null); })();
export class BComponent {
    constructor() {
        this.show = true;
    }
}
BComponent.ɵfac = function BComponent_Factory(t) { return new (t || BComponent)(); };
BComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: BComponent, selector: "b-component", ngImport: i0, template: { source: `
    <ng-content *ngIf="show"></ng-content>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(BComponent, [{
        type: Component,
        args: [{
                selector: 'b-component',
                template: `
    <ng-content *ngIf="show"></ng-content>
  `,
            }]
    }], null, null); })();
export class AModule {
}
AModule.ɵmod = i0.ɵɵdefineNgModule({ type: AModule });
AModule.ɵinj = i0.ɵɵdefineInjector({ factory: function AModule_Factory(t) { return new (t || AModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(AModule, { declarations: [AComponent, BComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(AModule, [{
        type: NgModule,
        args: [{ declarations: [AComponent, BComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: unique_template_function_names_ng_content.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class AComponent {
    show: boolean;
    static ɵfac: i0.ɵɵFactoryDef<AComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<AComponent, "a-component", never, {}, {}, never, ["*"]>;
}
export declare class BComponent {
    show: boolean;
    static ɵfac: i0.ɵɵFactoryDef<BComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<BComponent, "b-component", never, {}, {}, never, ["*"]>;
}
export declare class AModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AModule, [typeof AComponent, typeof BComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<AModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: unique_listener_function_names.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.items = [4, 2];
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div *ngFor="let item of items">
      <p (click)="$event">{{ item }}</p>
      <p (click)="$event">{{ item }}</p>
    </div>
    <div *ngFor="let item of items">
      <p (click)="$event">{{ item }}</p>
    </div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div *ngFor="let item of items">
      <p (click)="$event">{{ item }}</p>
      <p (click)="$event">{{ item }}</p>
    </div>
    <div *ngFor="let item of items">
      <p (click)="$event">{{ item }}</p>
    </div>
  `,
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: unique_listener_function_names.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    items: number[];
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: template_binding_pipe.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `<div *ngIf="val | pipe"></div>`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `<div *ngIf="val | pipe"></div>`,
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: template_binding_pipe.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: nested_ternary_operation.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    {{a?.b ? 1 : 2 }}`, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    {{a?.b ? 1 : 2 }}`,
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: nested_ternary_operation.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    a: any;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

