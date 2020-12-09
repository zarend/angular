/****************************************************************************************************
 * PARTIAL FILE: static_and_dynamic.js
 ****************************************************************************************************/
import { Component, HostBinding, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.myStyle = { width: '100px' };
        this.myClass = { bar: false };
        this.myColorProp = 'red';
        this.myFooClass = 'red';
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", host: { properties: { "style": "myStyle", "class": "myClass", "style.color": "myColorProp", "class.foo": "myFooClass" }, styleAttribute: "width:200px; height:500px", classAttribute: "foo baz" }, ngImport: i0, template: { source: '', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: '',
                host: { 'style': 'width:200px; height:500px', 'class': 'foo baz' }
            }]
    }], null, { myStyle: [{
            type: HostBinding,
            args: ['style']
        }], myClass: [{
            type: HostBinding,
            args: ['class']
        }], myColorProp: [{
            type: HostBinding,
            args: ['style.color']
        }], myFooClass: [{
            type: HostBinding,
            args: ['class.foo']
        }] }); })();
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
 * PARTIAL FILE: static_and_dynamic.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    myStyle: {
        width: string;
    };
    myClass: {
        bar: boolean;
    };
    myColorProp: string;
    myFooClass: string;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: multiple_dynamic.js
 ****************************************************************************************************/
import { Component, HostBinding, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.myHeightProp = 20;
        this.myBarClass = true;
        this.myStyle = {};
        this.myWidthProp = '500px';
        this.myFooClass = true;
        this.myClasses = { a: true, b: true };
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", host: { properties: { "style.height.pt": "myHeightProp", "class.bar": "myBarClass", "style": "myStyle", "style.width": "myWidthProp", "class.foo": "myFooClass", "class": "myClasses" } }, ngImport: i0, template: { source: '', isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: '',
                host: { '[style.height.pt]': 'myHeightProp', '[class.bar]': 'myBarClass' }
            }]
    }], null, { myStyle: [{
            type: HostBinding,
            args: ['style']
        }], myWidthProp: [{
            type: HostBinding,
            args: ['style.width']
        }], myFooClass: [{
            type: HostBinding,
            args: ['class.foo']
        }], myClasses: [{
            type: HostBinding,
            args: ['class']
        }] }); })();
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
 * PARTIAL FILE: multiple_dynamic.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    myHeightProp: number;
    myBarClass: boolean;
    myStyle: {};
    myWidthProp: string;
    myFooClass: boolean;
    myClasses: {
        a: boolean;
        b: boolean;
    };
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: important.js
 ****************************************************************************************************/
import { Component, HostBinding, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.myStyleExp = '';
        this.myClassExp = '';
        this.myFooClassExp = true;
        this.myWidthExp = '100px';
        this.myBarClassExp = true;
        this.myHeightExp = '200px';
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", host: { properties: { "style!important": "myStyleExp", "class!important": "myClassExp", "class.foo!important": "myFooClassExp", "style.width!important": "myWidthExp" } }, ngImport: i0, template: { source: `
    <div [style.height!important]="myHeightExp"
         [class.bar!important]="myBarClassExp"></div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div [style.height!important]="myHeightExp"
         [class.bar!important]="myBarClassExp"></div>
  `,
                host: { '[style!important]': 'myStyleExp', '[class!important]': 'myClassExp' }
            }]
    }], null, { myFooClassExp: [{
            type: HostBinding,
            args: ['class.foo!important']
        }], myWidthExp: [{
            type: HostBinding,
            args: ['style.width!important']
        }] }); })();
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
 * PARTIAL FILE: important.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    myStyleExp: string;
    myClassExp: string;
    myFooClassExp: boolean;
    myWidthExp: string;
    myBarClassExp: boolean;
    myHeightExp: string;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: class_interpolation.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.p1 = 100;
        this.p2 = 100;
        this.p3 = 100;
        this.p4 = 100;
        this.p5 = 100;
        this.p6 = 100;
        this.p7 = 100;
        this.p8 = 100;
        this.p9 = 100;
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div class="A{{p1}}B"></div>
    <div class="A{{p1}}B{{p2}}C"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H{{p8}}I"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H{{p8}}I{{p9}}J"></div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div class="A{{p1}}B"></div>
    <div class="A{{p1}}B{{p2}}C"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H{{p8}}I"></div>
    <div class="A{{p1}}B{{p2}}C{{p3}}D{{p4}}E{{p5}}F{{p6}}G{{p7}}H{{p8}}I{{p9}}J"></div>
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
 * PARTIAL FILE: class_interpolation.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    p5: number;
    p6: number;
    p7: number;
    p8: number;
    p9: number;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: style_interpolation.js
 ****************************************************************************************************/
import { Component, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class MyComponent {
    constructor() {
        this.p1 = 100;
        this.p2 = 100;
        this.p3 = 100;
        this.p4 = 100;
        this.p5 = 100;
        this.p6 = 100;
        this.p7 = 100;
        this.p8 = 100;
        this.p9 = 100;
    }
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: `
    <div style="p1:{{p1}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};p8:{{p8}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};p8:{{p8}};p9:{{p9}};"></div>
  `, isInline: true } });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: `
    <div style="p1:{{p1}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};p8:{{p8}};"></div>
    <div style="p1:{{p1}};p2:{{p2}};p3:{{p3}};p4:{{p4}};p5:{{p5}};p6:{{p6}};p7:{{p7}};p8:{{p8}};p9:{{p9}};"></div>
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
 * PARTIAL FILE: style_interpolation.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class MyComponent {
    p1: number;
    p2: number;
    p3: number;
    p4: number;
    p5: number;
    p6: number;
    p7: number;
    p8: number;
    p9: number;
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

/****************************************************************************************************
 * PARTIAL FILE: multiple_directives.js
 ****************************************************************************************************/
import { Component, Directive, HostBinding, NgModule } from '@angular/core';
import * as i0 from "@angular/core";
export class ClassDirective {
    constructor() {
        this.myClassMap = { red: true };
    }
}
ClassDirective.ɵfac = function ClassDirective_Factory(t) { return new (t || ClassDirective)(); };
ClassDirective.ɵdir = i0.ɵɵngDeclareDirective({ version: "0.0.0-PLACEHOLDER", type: ClassDirective, selector: "[myClassDir]", host: { properties: { "class": "myClassMap" } }, ngImport: i0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(ClassDirective, [{
        type: Directive,
        args: [{ selector: '[myClassDir]' }]
    }], null, { myClassMap: [{
            type: HostBinding,
            args: ['class']
        }] }); })();
export class WidthDirective {
    constructor() {
        this.myWidth = 200;
        this.myFooClass = true;
    }
}
WidthDirective.ɵfac = function WidthDirective_Factory(t) { return new (t || WidthDirective)(); };
WidthDirective.ɵdir = i0.ɵɵngDeclareDirective({ version: "0.0.0-PLACEHOLDER", type: WidthDirective, selector: "[myWidthDir]", host: { properties: { "style.width": "myWidth", "class.foo": "myFooClass" } }, ngImport: i0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(WidthDirective, [{
        type: Directive,
        args: [{ selector: '[myWidthDir]' }]
    }], null, { myWidth: [{
            type: HostBinding,
            args: ['style.width']
        }], myFooClass: [{
            type: HostBinding,
            args: ['class.foo']
        }] }); })();
export class HeightDirective {
    constructor() {
        this.myHeight = 200;
        this.myBarClass = true;
    }
}
HeightDirective.ɵfac = function HeightDirective_Factory(t) { return new (t || HeightDirective)(); };
HeightDirective.ɵdir = i0.ɵɵngDeclareDirective({ version: "0.0.0-PLACEHOLDER", type: HeightDirective, selector: "[myHeightDir]", host: { properties: { "style.height": "myHeight", "class.bar": "myBarClass" } }, ngImport: i0 });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(HeightDirective, [{
        type: Directive,
        args: [{ selector: '[myHeightDir]' }]
    }], null, { myHeight: [{
            type: HostBinding,
            args: ['style.height']
        }], myBarClass: [{
            type: HostBinding,
            args: ['class.bar']
        }] }); })();
export class MyComponent {
}
MyComponent.ɵfac = function MyComponent_Factory(t) { return new (t || MyComponent)(); };
MyComponent.ɵcmp = i0.ɵɵngDeclareComponent({ version: "0.0.0-PLACEHOLDER", type: MyComponent, selector: "my-component", ngImport: i0, template: { source: '<div myWidthDir myHeightDir myClassDir></div>', isInline: true }, directives: [{ type: WidthDirective, selector: "[myWidthDir]" }, { type: HeightDirective, selector: "[myHeightDir]" }, { type: ClassDirective, selector: "[myClassDir]" }] });
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyComponent, [{
        type: Component,
        args: [{
                selector: 'my-component',
                template: '<div myWidthDir myHeightDir myClassDir></div>',
            }]
    }], null, null); })();
export class MyModule {
}
MyModule.ɵmod = i0.ɵɵdefineNgModule({ type: MyModule });
MyModule.ɵinj = i0.ɵɵdefineInjector({ factory: function MyModule_Factory(t) { return new (t || MyModule)(); } });
(function () { (typeof ngJitMode === "undefined" || ngJitMode) && i0.ɵɵsetNgModuleScope(MyModule, { declarations: [MyComponent, WidthDirective, HeightDirective, ClassDirective] }); })();
/*@__PURE__*/ (function () { i0.ɵsetClassMetadata(MyModule, [{
        type: NgModule,
        args: [{ declarations: [MyComponent, WidthDirective, HeightDirective, ClassDirective] }]
    }], null, null); })();

/****************************************************************************************************
 * PARTIAL FILE: multiple_directives.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class ClassDirective {
    myClassMap: {
        red: boolean;
    };
    static ɵfac: i0.ɵɵFactoryDef<ClassDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<ClassDirective, "[myClassDir]", never, {}, {}, never>;
}
export declare class WidthDirective {
    myWidth: number;
    myFooClass: boolean;
    static ɵfac: i0.ɵɵFactoryDef<WidthDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<WidthDirective, "[myWidthDir]", never, {}, {}, never>;
}
export declare class HeightDirective {
    myHeight: number;
    myBarClass: boolean;
    static ɵfac: i0.ɵɵFactoryDef<HeightDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<HeightDirective, "[myHeightDir]", never, {}, {}, never>;
}
export declare class MyComponent {
    static ɵfac: i0.ɵɵFactoryDef<MyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<MyComponent, "my-component", never, {}, {}, never, never>;
}
export declare class MyModule {
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<MyModule, [typeof MyComponent, typeof WidthDirective, typeof HeightDirective, typeof ClassDirective], never, never>;
    static ɵinj: i0.ɵɵInjectorDef<MyModule>;
}

