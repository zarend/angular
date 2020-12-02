/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {absoluteFrom, absoluteFrom as _} from '@angular/compiler-cli/src/ngtsc/file_system';
import {initMockFileSystem, TestFile} from '@angular/compiler-cli/src/ngtsc/file_system/testing';

import {extractCursorInfo, LanguageServiceTestEnvironment} from './env';
import {humanizeDocumentSpanLike} from './test_utils';

describe('find references and rename locations', () => {
  let env: LanguageServiceTestEnvironment;

  beforeEach(() => {
    initMockFileSystem('Native');
  });

  describe('cursor is on binding in component class', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({templateUrl: './app.html'})
          export class AppCmp {
            myP¦rop!: string;
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
      const templateFile = {name: _('/app.html'), contents: '{{myProp}}'};
      createModuleWithDeclarations([appFile], [templateFile]);
    })

    it('gets component member references from TS file and external template', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
      expect(refs.length).toBe(2);
      assertFileNames(refs, ['app.html', 'app.ts']);
      assertTextSpans(refs, ['myProp']);
    });

    it('gets rename locations from TS file and external template', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
      expect(renameLocations.length).toBe(2);
      assertFileNames(renameLocations, ['app.html', 'app.ts']);
      assertTextSpans(renameLocations, ['myProp']);
    });
  })

  describe('when cursor is on binding in an external template', () => {
    let cursor: number;

    beforeEach(() => {
      const appFile = {
        name: _('/app.ts'),
        contents: `
          import {Component} from '@angular/core';

          @Component({templateUrl: './app.html'})
          export class AppCmp {
            myProp = '';
          }`,
      };
      const cursorInfo = extractCursorInfo('{{myP¦rop}}');
      cursor = cursorInfo.cursor;
      const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile], [templateFile]);
    })

    it('gets component member references from template', () => {
      const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
      expect(refs.length).toBe(2);
      assertFileNames(refs, ['app.html', 'app.ts']);
      assertTextSpans(refs, ['myProp']);
    });

    it('gets component rename locations from template', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
      expect(renameLocations.length).toBe(2);
      assertFileNames(renameLocations, ['app.html', 'app.ts']);
      assertTextSpans(renameLocations, ['myProp']);
    });
  })

  describe('when cursor is on function call in external template', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<div (click)="set¦Title(2)"></div>'})
          export class AppCmp {
            setTitle(s: number) {}
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile]);
    })

    it('gets component member reference in ts file', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
      expect(refs.length).toBe(2);

      assertFileNames(refs, ['app.ts']);
      assertTextSpans(refs, ['setTitle']);
    });

    it('gets rename location in ts file', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
      expect(renameLocations.length).toBe(2);

      assertFileNames(renameLocations, ['app.ts']);
      assertTextSpans(renameLocations, ['setTitle']);
    });
  })

  describe('when cursor in on argument to a function call in an external template', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<div (click)="setTitle(ti¦tle)"></div>'})
          export class AppCmp {
            title = '';
            setTitle(s: string) {}
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile]);
    })

    it('gets member reference in ts file', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
      expect(refs.length).toBe(2);

      assertTextSpans(refs, ['title']);
    });

    it('finds rename location in ts file', () => {
      const refs = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
      expect(refs.length).toBe(2);

      assertTextSpans(refs, ['title']);
    });
  })

  describe('when cursor in on LHS of property write in external template', () => {
    let cursor: number;

    beforeEach(() => {
      const appFile = {
        name: _('/app.ts'),
        contents: `
          import {Component} from '@angular/core';

          @Component({templateUrl: './app.html' })
          export class AppCmp {
            title = '';
          }`,
      };
      const templateFileWithCursor = `<div (click)="ti¦tle = 'newtitle'"></div>`;
      const cursorInfo = extractCursorInfo(templateFileWithCursor);
      cursor = cursorInfo.cursor;
      const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile], [templateFile]);
    })

    it('gets member reference in ts file', () => {
      const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
      expect(refs.length).toBe(2);

      assertFileNames(refs, ['app.ts', 'app.html']);
      assertTextSpans(refs, ['title']);
    });

    it('gets rename location in ts file', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
      expect(renameLocations.length).toBe(2);

      assertFileNames(renameLocations, ['app.ts', 'app.html']);
      assertTextSpans(renameLocations, ['title']);
    })
  })

  describe('when cursor in on RHS of property write in external template', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<div (click)="title = otherT¦itle"></div>' })
          export class AppCmp {
            title = '';
            otherTitle = '';
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {
        name: _('/app.ts'),
        contents: cursorInfo.text,
      };
      createModuleWithDeclarations([appFile]);
    })

    it('get reference to member in ts file', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
      expect(refs.length).toBe(2);

      assertFileNames(refs, ['app.ts']);
      assertTextSpans(refs, ['otherTitle']);
    });

    it('finds rename location in ts file', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
      expect(renameLocations.length).toBe(2);

      assertFileNames(renameLocations, ['app.ts']);
      assertTextSpans(renameLocations, ['otherTitle']);
    });
  })

  describe('when cursor in on a keyed read', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '{{hero["na¦me"]}}' })
          export class AppCmp {
            hero: {name: string} = {name: 'Superman'};
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {
        name: _('/app.ts'),
        contents: cursorInfo.text,
      };
      createModuleWithDeclarations([appFile]);
    })

    it('gets reference to member type definition and initialization in component class', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
      // 3 references: the type definition, the value assignment, and the read in the template
      expect(refs.length).toBe(3);

      assertFileNames(refs, ['app.ts']);
      // TODO(atscott): investigate if we can make the template keyed read be just the 'name' part.
      // The TypeScript implementation specifically adjusts the span to accommodate string literals:
      // https://sourcegraph.com/github.com/microsoft/TypeScript@d5779c75d3dd19565b60b9e2960b8aac36d4d635/-/blob/src/services/findAllReferences.ts#L508-512
      // One possible solution would be to extend `FullTemplateMapping` to include the matched TCB
      // node and then do the same thing that TS does: if the node is a string, adjust the span.
      assertTextSpans(refs, ['name', '"name"']);
    });

    it('gets rename locations in component class', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
      expect(renameLocations).toBeUndefined();

      // TODO(atscott): We should handle this case. The fix requires us to fix the result span as
      // described above.
      // 3 references: the type definition, the value assignment, and the read in the template
      // expect(renameLocations.length).toBe(3);
      //
      // assertFileNames(renameLocations, ['app.ts']);
      // assertTextSpans(renameLocations, ['name']);
    });
  })

  describe('when cursor in on RHS of keyed write in a template', () => {
    let cursor: number;

    beforeEach(() => {
      const appFile = {
        name: _('/app.ts'),
        contents: `
          import {Component} from '@angular/core';

          @Component({templateUrl: './app.html' })
          export class AppCmp {
            hero: {name: string} = {name: 'Superman'};
            batman = 'batman';
          }`,
      };
      const templateFileWithCursor = `<div (click)="hero['name'] = bat¦man"></div>`;
      const cursorInfo = extractCursorInfo(templateFileWithCursor);
      cursor = cursorInfo.cursor;
      const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile], [templateFile]);
    })

    it('get references in ts file', () => {
      const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
      expect(refs.length).toBe(2);

      assertFileNames(refs, ['app.ts', 'app.html']);
      assertTextSpans(refs, ['batman']);
    });

    it('finds rename location in ts file', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
      expect(renameLocations.length).toBe(2);

      assertFileNames(renameLocations, ['app.ts', 'app.html']);
      assertTextSpans(renameLocations, ['batman']);
    });
  })

  describe('when cursor in on an element reference', () => {
    let cursor: number;

    beforeEach(() => {
      const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<input #myInput /> {{ myIn¦put.value }}'})
          export class AppCmp {
            title = '';
          }`);
      cursor = cursorInfo.cursor;
      const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile]);
    })

    it('get reference to declaration in template', () => {
      const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;

      expect(refs.length).toBe(2);
      assertTextSpans(refs, ['myInput']);

      // Get the declaration by finding the reference that appears first in the template
      refs.sort((a, b) => a.textSpan.start - b.textSpan.start);
      expect(refs[0].isDefinition).toBe(true);
    })

    it('finds rename location in template', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;

      expect(renameLocations.length).toBe(2);
      assertTextSpans(renameLocations, ['myInput']);
    })
  })

  describe('when cursor in on a template reference', () => {
    let cursor: number;

    beforeEach(() => {
      const templateWithCursor = `
              <ng-template #myTemplate >bla</ng-template>
              <ng-container [ngTemplateOutlet]="myTem¦plate"></ng-container>`;
      const appFile = {
        name: _('/app.ts'),
        contents: `
          import {Component} from '@angular/core';

          @Component({templateUrl: './app.html'})
          export class AppCmp {
            title = '';
          }`,
      };
      const cursorInfo = extractCursorInfo(templateWithCursor);
      cursor = cursorInfo.cursor;
      const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
      createModuleWithDeclarations([appFile], [templateFile]);
    })

    it('gets reference to declaration', () => {
      const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
      expect(refs.length).toBe(2);
      assertTextSpans(refs, ['myTemplate']);
      assertFileNames(refs, ['app.html']);

      // Get the declaration by finding the reference that appears first in the template
      refs.sort((a, b) => a.textSpan.start - b.textSpan.start);
      expect(refs[0].isDefinition).toBe(true);
    });

    it('finds rename location in template', () => {
      const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
      expect(renameLocations.length).toBe(2);
      assertTextSpans(renameLocations, ['myTemplate']);
      assertFileNames(renameLocations, ['app.html']);
    })
  })

  describe('template references', () => {
    describe('directives', () => {
      let appFile: TestFile;
      let dirFile: TestFile;

      beforeEach(() => {
        const dirFileContents = `
            import {Directive} from '@angular/core';

            @Directive({selector: '[dir]', exportAs: 'myDir'})
            export class Dir {
              dirValue!: string;
              doSomething() {}
            }`;
        const appFileContents = `
            import {Component} from '@angular/core';

            @Component({templateUrl: './app.html'})
            export class AppCmp {}`;
        appFile = {name: _('/app.ts'), contents: appFileContents};
        dirFile = {name: _('/dir.ts'), contents: dirFileContents};
      });

      describe('when cursor is on usage of template reference', () => {
        let cursor: number;
        beforeEach(() => {
          const templateWithCursor = '<div [dir] #dirRef="myDir"></div> {{ dirR¦ef }}';
          const cursorInfo = extractCursorInfo(templateWithCursor);
          cursor = cursorInfo.cursor;
          const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
          createModuleWithDeclarations([appFile, dirFile], [templateFile]);
        });

        it('should get references', () => {
          const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
          expect(refs.length).toBe(2);
          assertFileNames(refs, ['app.html']);
          assertTextSpans(refs, ['dirRef']);
        });

        it('should find rename locations', () => {
          const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
          expect(renameLocations.length).toBe(2);
          assertFileNames(renameLocations, ['app.html']);
          assertTextSpans(renameLocations, ['dirRef']);
        });
      });

      describe('when cursor is on a property read of directive reference', () => {
        let cursor: number;
        beforeEach(() => {
          const fileWithCursor = '<div [dir] #dirRef="myDir"></div> {{ dirRef.dirV¦alue }}';
          const cursorInfo = extractCursorInfo(fileWithCursor);
          cursor = cursorInfo.cursor;
          const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
          createModuleWithDeclarations([appFile, dirFile], [templateFile]);
        });

        it('should get references', () => {
          const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
          expect(refs.length).toBe(2);
          assertFileNames(refs, ['dir.ts', 'app.html']);
          assertTextSpans(refs, ['dirValue']);
        });

        it('should find rename locations', () => {
          const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
          expect(renameLocations.length).toBe(2);
          assertFileNames(renameLocations, ['dir.ts', 'app.html']);
          assertTextSpans(renameLocations, ['dirValue']);
        });
      });

      describe('when cursor is on a safe prop read', () => {
        let cursor: number;
        beforeEach(() => {
          const fileWithCursor = '<div [dir] #dirRef="myDir"></div> {{ dirRef?.dirV¦alue }}';
          const cursorInfo = extractCursorInfo(fileWithCursor);
          cursor = cursorInfo.cursor;
          const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
          createModuleWithDeclarations([appFile, dirFile], [templateFile]);
        });


        it('should get references', () => {
          const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
          expect(refs.length).toBe(2);
          assertFileNames(refs, ['dir.ts', 'app.html']);
          assertTextSpans(refs, ['dirValue']);
        });

        it('should find rename locations', () => {
          const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
          expect(renameLocations.length).toBe(2);
          assertFileNames(renameLocations, ['dir.ts', 'app.html']);
          assertTextSpans(renameLocations, ['dirValue']);
        });
      });

      describe('when cursor is on safe method call', () => {
        let cursor: number;
        beforeEach(() => {
          const fileWithCursor = '<div [dir] #dirRef="myDir"></div> {{ dirRef?.doSometh¦ing() }}';
          const cursorInfo = extractCursorInfo(fileWithCursor);
          cursor = cursorInfo.cursor;
          const templateFile = {name: _('/app.html'), contents: cursorInfo.text};
          createModuleWithDeclarations([appFile, dirFile], [templateFile]);
        });


        it('should get references', () => {
          const refs = getReferencesAtPosition(_('/app.html'), cursor)!;
          expect(refs.length).toBe(2);
          assertFileNames(refs, ['dir.ts', 'app.html']);
          assertTextSpans(refs, ['doSomething']);
        });

        it('should find rename locations', () => {
          const renameLocations = getRenameLocationsAtPosition(_('/app.html'), cursor)!;
          expect(renameLocations.length).toBe(2);
          assertFileNames(renameLocations, ['dir.ts', 'app.html']);
          assertTextSpans(renameLocations, ['doSomething']);
        });
      });
    });
  });

  describe('template variables', () => {
    describe('when cursor is on variable which was initialized implicitly', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<div *ngFor="let hero of heroes">{{her¦o}}</div>'})
          export class AppCmp {
            heroes: string[] = [];
          }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(2);
        assertFileNames(refs, ['app.ts']);
        assertTextSpans(refs, ['hero']);

        const originalRefs = env.ngLS.getReferencesAtPosition(_('/app.ts'), cursor)!;
        // Get the declaration by finding the reference that appears first in the template
        originalRefs.sort((a, b) => a.textSpan.start - b.textSpan.start);
        expect(originalRefs[0].isDefinition).toBe(true);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toBe(2);
        assertFileNames(renameLocations, ['app.ts']);
        assertTextSpans(renameLocations, ['hero']);
      });
    });

    describe('when cursor is on renamed variable', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(`
          import {Component} from '@angular/core';

          @Component({template: '<div *ngFor="let hero of heroes; let iRef = index">{{iR¦ef}}</div>'})
          export class AppCmp {
            heroes: string[] = [];
          }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(2);
        assertFileNames(refs, ['app.ts']);
        assertTextSpans(refs, ['iRef']);

        const originalRefs = env.ngLS.getReferencesAtPosition(_('/app.ts'), cursor)!;
        // Get the declaration by finding the reference that appears first in the template
        originalRefs.sort((a, b) => a.textSpan.start - b.textSpan.start);
        expect(originalRefs[0].isDefinition).toBe(true);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toBe(2);
        assertFileNames(renameLocations, ['app.ts']);
        assertTextSpans(renameLocations, ['iRef']);
      });
    });

    describe('when cursor is on initializer of variable', () => {
      let cursor: number;
      beforeEach(() => {
        const dirFile = `
        import {Directive, Input} from '@angular/core';

        export class ExampleContext<T> {
          constructor(readonly $implicit: T, readonly identifier: string) {}
        }

        @Directive({ selector: '[example]' })
        export class ExampleDirective<T> {
          @Input() set example(v: T) { }
          static ngTemplateContextGuard<T>(dir: ExampleDirective<T>, ctx: unknown):
            ctx is ExampleContext<T> {
            return true;
          }
        }`;
        const fileWithCursor = `
        import {Component, NgModule} from '@angular/core';
        import {ExampleDirective} from './example-directive';

        @Component({template: '<div *example="state; let id = identif¦ier">{{id}}</div>'})
        export class AppCmp {
          state = {};
        }

        @NgModule({declarations: [AppCmp, ExampleDirective]})
        export class AppModule {}`;
        const cursorInfo = extractCursorInfo(fileWithCursor);
        cursor = cursorInfo.cursor;
        env = LanguageServiceTestEnvironment.setup([
          {name: _('/app.ts'), contents: cursorInfo.text, isRoot: true},
          {name: _('/example-directive.ts'), contents: dirFile},
        ]);
        env.expectNoSourceDiagnostics();
        env.expectNoTemplateDiagnostics(absoluteFrom('/app.ts'), 'AppCmp');
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(2);
        assertFileNames(refs, ['app.ts', 'example-directive.ts']);
        assertTextSpans(refs, ['identifier']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toBe(2);
        assertFileNames(renameLocations, ['app.ts', 'example-directive.ts']);
        assertTextSpans(renameLocations, ['identifier']);
      });
    });

    describe('when cursor is on property read of variable', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(`
            import {Component} from '@angular/core';

            @Component({template: '<div *ngFor="let hero of heroes">{{hero.na¦me}}</div>'})
            export class AppCmp {
              heroes: Array<{name: string}> = [];
            }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(2);
        assertFileNames(refs, ['app.ts']);
        assertTextSpans(refs, ['name']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toBe(2);
        assertFileNames(renameLocations, ['app.ts']);
        assertTextSpans(renameLocations, ['name']);
      });
    });
  });

  describe('pipes', () => {
    let prefixPipeFile: TestFile;
    beforeEach(() => {
      const prefixPipe = `
        import {Pipe, PipeTransform} from '@angular/core';

        @Pipe({ name: 'prefixPipe' })
        export class PrefixPipe implements PipeTransform {
          transform(value: string, prefix: string): string;
          transform(value: number, prefix: number): number;
          transform(value: string|number, prefix: string|number): string|number {
            return '';
          }
        }`;
      prefixPipeFile = {name: _('/prefix-pipe.ts'), contents: prefixPipe};
    });

    describe('when cursor is on pipe name', () => {
      let cursor: number;
      beforeEach(() => {
        const appContentsWithCursor = `
        import {Component} from '@angular/core';

        @Component({template: '{{birthday | prefi¦xPipe: "MM/dd/yy"}}'})
        export class AppCmp {
          birthday = '';
        }
      `;
        const cursorInfo = extractCursorInfo(appContentsWithCursor);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile, prefixPipeFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(5);
        assertFileNames(refs, ['index.d.ts', 'prefix-pipe.ts', 'app.ts']);
        assertTextSpans(refs, ['transform', 'prefixPipe']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations).toBeUndefined();

        // TODO(atscott): Add support for renaming the pipe 'name'
        // expect(renameLocations.length).toBe(2);
        // assertFileNames(renameLocations, ['prefix-pipe.ts', 'app.ts']);
        // assertTextSpans(renameLocations, ['prefixPipe']);
      });
    });

    describe('when cursor is on pipe argument', () => {
      let cursor: number;
      beforeEach(() => {
        const appContentsWithCursor = `
        import {Component} from '@angular/core';

        @Component({template: '{{birthday | prefixPipe: pr¦efix}}'})
        export class AppCmp {
          birthday = '';
          prefix = '';
        }
      `;
        const cursorInfo = extractCursorInfo(appContentsWithCursor);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile, prefixPipeFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toBe(2);
        assertFileNames(refs, ['app.ts']);
        assertTextSpans(refs, ['prefix']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toBe(2);
        assertFileNames(renameLocations, ['app.ts']);
        assertTextSpans(renameLocations, ['prefix']);
      });
    });
  });

  describe('inputs', () => {
    const dirFileContents = `
        import {Directive, Input} from '@angular/core';

        @Directive({selector: '[string-model]'})
        export class StringModel {
          @Input() model!: string;
          @Input('alias') aliasedModel!: string;
        }`;
    describe('when cursor is on the input in the template', () => {
      let cursor: number;
      beforeEach(() => {
        const stringModelTestFile = {name: _('/string-model.ts'), contents: dirFileContents};
        const cursorInfo = extractCursorInfo(`
        import {Component} from '@angular/core';

        @Component({template: '<div string-model [mod¦el]="title"></div>'})
        export class AppCmp {
          title = 'title';
        }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile, stringModelTestFile]);
      })

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertFileNames(refs, ['string-model.ts', 'app.ts']);
        assertTextSpans(refs, ['model']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toEqual(2);
        assertFileNames(renameLocations, ['string-model.ts', 'app.ts']);
        assertTextSpans(renameLocations, ['model']);
      });
    });

    describe('should work when cursor is on text attribute input', () => {
      let cursor: number;
      beforeEach(() => {
        const stringModelTestFile = {name: _('/string-model.ts'), contents: dirFileContents};
        const cursorInfo = extractCursorInfo(`
        import {Component} from '@angular/core';

        @Component({template: '<div string-model mod¦el="title"></div>'})
        export class AppCmp {
          title = 'title';
        }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile, stringModelTestFile]);
      });

      it('should work for text attributes', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertFileNames(refs, ['string-model.ts', 'app.ts']);
        assertTextSpans(refs, ['model']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toEqual(2);
        assertFileNames(renameLocations, ['string-model.ts', 'app.ts']);
        assertTextSpans(renameLocations, ['model']);
      });
    });

    describe('when cursor is on the class member input', () => {
      let cursor: number;
      beforeEach(() => {
        const dirFileWithCursor = `
        import {Directive, Input} from '@angular/core';

        @Directive({selector: '[string-model]'})
        export class StringModel {
          @Input() mod¦el!: string;
        }`;
        const cursorInfo = extractCursorInfo(dirFileWithCursor);
        cursor = cursorInfo.cursor;
        const stringModelTestFile = {name: _('/string-model.ts'), contents: cursorInfo.text};
        const appFile = {
          name: _('/app.ts'),
          contents: `
        import {Component} from '@angular/core';

        @Component({template: '<div string-model model="title"></div>'})
        export class AppCmp {
          title = 'title';
        }`,
        };
        createModuleWithDeclarations([appFile, stringModelTestFile]);
      });

      it('should work from the TS input declaration', () => {
        const refs = getReferencesAtPosition(_('/string-model.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertFileNames(refs, ['app.ts', 'string-model.ts']);
        assertTextSpans(refs, ['model']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/string-model.ts'), cursor)!;
        expect(renameLocations.length).toEqual(2);
        assertFileNames(renameLocations, ['app.ts', 'string-model.ts']);
        assertTextSpans(renameLocations, ['model']);
      });
    });

    describe('when cursor is on input referenced somewhere in the class functions', () => {
      let cursor: number;
      beforeEach(() => {
        const otherDirContents = `
        import {Directive, Input} from '@angular/core';
        import {StringModel} from './string-model';

        @Directive({selector: '[other-dir]'})
        export class OtherDir {
          @Input() stringModelRef!: StringModel;

          doSomething() {
            console.log(this.stringModelRef.mod¦el);
          }
        }`;
        const cursorInfo = extractCursorInfo(otherDirContents);
        cursor = cursorInfo.cursor;
        const otherDirFile = {name: _('/other-dir.ts'), contents: cursorInfo.text};
        const stringModelTestFile = {
          name: _('/string-model.ts'),
          contents: `
        import {Directive, Input} from '@angular/core';

        @Directive({selector: '[string-model]'})
        export class StringModel {
          @Input() model!: string;
        }`,
        };
        const appFile = {
          name: _('/app.ts'),
          contents: `
        import {Component} from '@angular/core';

        @Component({template: '<div string-model other-dir model="title"></div>'})
        export class AppCmp {
          title = 'title';
        }`,
        };
        createModuleWithDeclarations([appFile, stringModelTestFile, otherDirFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/other-dir.ts'), cursor)!;
        expect(refs.length).toEqual(3);
        assertFileNames(refs, ['app.ts', 'string-model.ts', 'other-dir.ts']);
        assertTextSpans(refs, ['model']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/other-dir.ts'), cursor)!;
        expect(renameLocations.length).toEqual(3);
        assertFileNames(renameLocations, ['app.ts', 'string-model.ts', 'other-dir.ts']);
        assertTextSpans(renameLocations, ['model']);
      });
    });

    describe('when cursor is on an aliased input', () => {
      let cursor: number;
      beforeEach(() => {
        const stringModelTestFile = {name: _('/string-model.ts'), contents: dirFileContents};
        const cursorInfo = extractCursorInfo(`
        import {Component} from '@angular/core';

        @Component({template: '<div string-model [al¦ias]="title"></div>'})
        export class AppCmp {
          title = 'title';
        }`);
        cursor = cursorInfo.cursor;
        const appFile = {name: _('/app.ts'), contents: cursorInfo.text};
        createModuleWithDeclarations([appFile, stringModelTestFile]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertFileNames(refs, ['string-model.ts', 'app.ts']);
        assertTextSpans(refs, ['aliasedModel', 'alias']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations).toBeUndefined();
        // TODO(atscott): add support for renaming alias outputs
        // expect(renameLocations.length).toEqual(2);
        // assertFileNames(renameLocations, ['string-model.ts', 'app.ts']);
        // assertTextSpans(renameLocations, ['alias']);
      });
    });
  });

  describe('outputs', () => {
    const dirFile = `
        import {Directive, Output, EventEmitter} from '@angular/core';

        @Directive({selector: '[string-model]'})
        export class StringModel {
          @Output() modelChange = new EventEmitter<string>();
          @Output('alias') aliasedModelChange = new EventEmitter<string>();
        }`;

    function generateAppFile(template: string) {
      return `
        import {Component, NgModule} from '@angular/core';
        import {StringModel} from './string-model';

        @Component({template: '${template}'})
        export class AppCmp {
          setTitle(s: string) {}
        }

        @NgModule({declarations: [AppCmp, StringModel]})
        export class AppModule {}`;
    }

    describe('when cursor is on output key in template', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(
            generateAppFile(`<div string-model (mod¦elChange)="setTitle($event)"></div>`));
        cursor = cursorInfo.cursor;
        env = LanguageServiceTestEnvironment.setup([
          {name: _('/app.ts'), contents: cursorInfo.text, isRoot: true},
          {name: _('/string-model.ts'), contents: dirFile},
        ]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertTextSpans(refs, ['modelChange']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations.length).toEqual(2);
        assertTextSpans(renameLocations, ['modelChange']);
      });
    });

    describe('when cursor is on alias output key', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(
            generateAppFile(`<div string-model (a¦lias)="setTitle($event)"></div>`));
        cursor = cursorInfo.cursor;
        env = LanguageServiceTestEnvironment.setup([
          {name: _('/app.ts'), contents: cursorInfo.text, isRoot: true},
          {name: _('/string-model.ts'), contents: dirFile},
        ]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/app.ts'), cursor)!;
        expect(refs.length).toEqual(2);
        assertTextSpans(refs, ['aliasedModelChange', 'alias']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/app.ts'), cursor)!;
        expect(renameLocations).toBeUndefined();
        // TODO(atscott): add support for renaming alias outputs
        // expect(renameLocations.length).toEqual(2);
        // assertTextSpans(renameLocations, ['alias']);
      });
    });
  });

  describe('directives', () => {
    describe('when cursor is on the directive class', () => {
      let cursor: number;
      beforeEach(() => {
        const cursorInfo = extractCursorInfo(`
      import {Directive} from '@angular/core';

      @Directive({selector: '[dir]'})
      export class Di¦r {}`);
        cursor = cursorInfo.cursor;
        const appFile = `
        import {Component, NgModule} from '@angular/core';
        import {Dir} from './dir';

        @Component({template: '<div dir></div>'})
        export class AppCmp {
        }

        @NgModule({declarations: [AppCmp, Dir]})
        export class AppModule {}
      `;
        env = LanguageServiceTestEnvironment.setup([
          {name: _('/app.ts'), contents: appFile, isRoot: true},
          {name: _('/dir.ts'), contents: cursorInfo.text},
        ]);
      });

      it('should find references', () => {
        const refs = getReferencesAtPosition(_('/dir.ts'), cursor)!;
        // 4 references are:  class declaration, template usage, app import and use in declarations
        // list.
        expect(refs.length).toBe(4);
        assertTextSpans(refs, ['<div dir>', 'Dir']);
        assertFileNames(refs, ['app.ts', 'dir.ts']);
      });

      it('should find rename locations', () => {
        const renameLocations = getRenameLocationsAtPosition(_('/dir.ts'), cursor)!;
        expect(renameLocations).toBeUndefined();
        // TODO(atscott): We should handle this case, but exclude the template results
        // expect(renameLocations.length).toBe(3);
        // assertTextSpans(renameLocations, ['Dir']);
        // assertFileNames(renameLocations, ['app.ts', 'dir.ts']);
      });
    });
  });

  function getReferencesAtPosition(fileName: string, position: number) {
    env.expectNoSourceDiagnostics();
    const result = env.ngLS.getReferencesAtPosition(fileName, position);
    return result?.map((item) => humanizeDocumentSpanLike(item, env));
  }

  function getRenameLocationsAtPosition(fileName: string, position: number) {
    env.expectNoSourceDiagnostics();
    const result = env.ngLS.findRenameLocations(fileName, position);
    return result?.map((item) => humanizeDocumentSpanLike(item, env));
  }

  function getFirstClassDeclaration(declaration: string) {
    const matches = declaration.match(/(?:export class )(\w+)(?:\s|\{)/);
    if (matches === null || matches.length !== 2) {
      throw new Error(`Did not find exactly one exported class in: ${declaration}`);
    }
    return matches[1].trim();
  }

  function createModuleWithDeclarations(
      filesWithClassDeclarations: TestFile[], externalResourceFiles: TestFile[] = []): void {
    const externalClasses =
        filesWithClassDeclarations.map(file => getFirstClassDeclaration(file.contents));
    const externalImports = filesWithClassDeclarations.map(file => {
      const className = getFirstClassDeclaration(file.contents);
      const fileName = last(file.name.split('/')).replace('.ts', '');
      return `import {${className}} from './${fileName}';`;
    });
    const contents = `
        import {NgModule} from '@angular/core';
        import {CommonModule} from '@angular/common';
        ${externalImports.join('\n')}

        @NgModule({
          declarations: [${externalClasses.join(',')}],
          imports: [CommonModule],
        })
        export class AppModule {}
      `;
    const moduleFile = {name: _('/app-module.ts'), contents, isRoot: true};
    env = LanguageServiceTestEnvironment.setup(
        [moduleFile, ...filesWithClassDeclarations, ...externalResourceFiles]);
  }
});

function assertFileNames(refs: Array<{fileName: string}>, expectedFileNames: string[]) {
  const actualPaths = refs.map(r => r.fileName);
  const actualFileNames = actualPaths.map(p => last(p.split('/')));
  expect(new Set(actualFileNames)).toEqual(new Set(expectedFileNames));
}

function assertTextSpans(refs: Array<{textSpan: string}>, expectedTextSpans: string[]) {
  const actualSpans = refs.map(ref => ref.textSpan);
  expect(new Set(actualSpans)).toEqual(new Set(expectedTextSpans));
}

function last<T>(array: T[]): T {
  return array[array.length - 1];
}
