import {LanguageServiceTestEnvironment} from '@angular/language-service/ivy/test/env';
import * as ts from 'typescript/lib/tsserverlibrary';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */


export function getText(contents: string, textSpan: ts.TextSpan) {
  return contents.substr(textSpan.start, textSpan.length);
}
export function humanizeDocumentSpanLike<T extends ts.DocumentSpan>(
    item: T, env: LanguageServiceTestEnvironment) {
  const fileContents = env.host.readFile(item.fileName);
  if (!fileContents) {
    throw new Error('Could not read file ${entry.fileName}');
  }
  return {
    ...item,
    textSpan: getText(fileContents, item.textSpan),
    contextSpan: item.contextSpan ? getText(fileContents, item.contextSpan) : undefined,
    originalTextSpan: item.originalTextSpan ? getText(fileContents, item.originalTextSpan) :
                                              undefined,
    originalContextSpan:
        item.originalContextSpan ? getText(fileContents, item.originalContextSpan) : undefined,
  };
}
