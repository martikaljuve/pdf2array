> [!NOTE]
> This project is a fork of https://github.com/tonyroberts/pdf2array.
>
> Changes in fork:
>
> -   Changed main function to accept pdf.js `PDFDocumentProxy` as first argument.
> -   Changed pdfjs-dist to peerDependency.
> -   Exposed separate functions for getting rows, stripping footers/subscripts and applying SLICE algorithm.

# pdf2array (fork) <!-- omit in toc -->

[![Tests](https://github.com/martikaljuve/pdf2array/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/martikaljuve/pdf2array/actions/workflows/tests.yml)

pdf2array is a Typescript package that loads PDF files and extracts text as a tabular array of values.

It uses [pdf.js](https://github.com/mozilla/pdf.js/) and is intended to make extracting tabular data from PDF files simpler.

For example usage see the [online demo](https://tonyroberts.github.io/pdf2array/).

**Table of Contents**

-   [API](#api)
    -   [pdf2array(doc, options)](#pdf2arraydoc-options)
    -   [getRows(doc, options)](#getrowsdoc-options)
    -   [stripFooters(rows, options)](#stripfootersrows-options)
    -   [stripSuperscript(rows, options)](#stripsuperscriptrows-options)
    -   [applySlice(rows, options)](#applyslicerows-options)
    -   [rowsToStrings(rows)](#rowstostringsrows)
    -   [Types](#types)
        -   [Pdf2ArrayOptions](#pdf2arrayoptions)
        -   [GetRowsOptions](#getrowsoptions)
        -   [StripFootersOptions](#stripfootersoptions)
        -   [StripSuperscriptOptions](#stripsuperscriptoptions)
        -   [ApplySliceOptions](#applysliceoptions)
        -   [TextItemWithPosition](#textitemwithposition)
        -   [Row](#row)
-   [Contribution](#contribution)
-   [License](#license)
-   [Support](#support)

## API

### pdf2array(doc, options)

Main function.

Calls [getRows](#getrowsdata-options), any filters ([stripFooters](#stripfootersrows-options)/[stripSuperscript](#stripsuperscriptrows-options)/[applySlice](#applyslicerows-options)), then [rowsToStrings](#rowstostringsrows).

Options: [Pdf2ArrayOptions](#pdf2arrayoptions).

```ts
async function pdf2array(doc: PDFDocumentProxy, options?: Pdf2ArrayOptions): Promise<string[][]>;
```

Example:

Node:

```ts
import pdf2array from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;

const result = await pdf2array(doc);
```

### getRows(doc, options)

Options: [GetRowsOptions](#getrowsoptions).

```ts
async function getRows(doc: PDFDocumentProxy, options?: GetRowsOptions): Promise<Row[]>;
```

Example:

```ts
import { getRows, rowsToStrings } from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;
const rows = await getRows(doc);
const strings = rowsToStrings(rows);
```

### stripFooters(rows, options)

Options: [StripFootersOptions](#stripfootersoptions).

```ts
function stripFooters(rows: Row[], options?: StripFootersOptions): Row[];
```

Example:

```ts
import { getRows, stripFooters, rowsToStrings } from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;
let rows = await getRows(doc);
rows = stripFooters(rows);
const data = rowsToStrings(rows);
```

### stripSuperscript(rows, options)

Options: [StripSuperscriptOptions](#stripsuperscriptoptions).

```ts
function stripSuperscript(rows: Row[], options?: StripSuperscriptOptions): Row[];
```

Example:

```ts
import { getRows, stripSuperscript, rowsToStrings } from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;
let rows = await getRows(doc);
rows = stripSuperscript(rows);
const data = rowsToStrings(rows);
```

### applySlice(rows, options)

Options: [ApplySliceOptions](#applysliceoptions).

```ts
function applySlice(rows: Row[], options?: ApplySliceOptions): Row[];
```

Example:

```ts
import { getRows, applySlice, rowsToStrings } from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;
let rows = await getRows(doc);
rows = applySlice(rows);
const data = rowsToStrings(rows);
```

### rowsToStrings(rows)

Maps the [Row](#row) items to strings (More specifically, the `str` property from [TextItem](https://mozilla.github.io/pdf.js/api/draft/module-pdfjsLib.html#~TextItem)-s).

```ts
function rowsToStrings(rows: Row[]): string[][];
```

Example:

```ts
import { getRows, rowsToStrings } from 'pdf2array';
import { getDocument } from 'pdfjs-dist';

const doc = await getDocument(/*...*/).promise;
let rows = await getRows(doc);
const data = rowsToStrings(rows);
```

### Types

#### Pdf2ArrayOptions

```ts
interface Pdf2ArrayOptions {
	pages?: number[];
	stripFooters?: boolean | StripFootersOptions;
	stripSuperscript?: boolean | StripSuperscriptOptions;
	slice?: boolean | SliceOptions;
	yTolerance?: number;
}
```

#### GetRowsOptions

```ts
interface GetRowsOptions {
	pages?: number[];
	yTolerance?: number;
}
```

#### StripFootersOptions

```ts
interface StripFootersOptions {
	/** @default 1 */
	yTolerance?: number;
	/** @default 1 */
	xTolerance?: number;
	/** @default 0.5 */
	confidence?: number;
}
```

#### StripSuperscriptOptions

```ts
interface StripSuperscriptOptions {
	/**
	 * distance to look from an item for the top corners of another item,
	 * as a fraction of the height of the item being inspected.
	 * @default 0.5
	 */
	radiusScale?: number;
	/**
	 * Only items smaller than the main text times this tolerance will be assumed to be
	 * superscript. Set to 1 if superscript is the same size as the main text.
	 * @default 0.75
	 */
	heightScale?: number;
	/**
	 * Strip superscripts that are to the left of the main text.
	 * @default true
	 */
	stripLeft?: boolean;
	/**
	 * Strip superscripts that are to the right of the main text.
	 * @default true
	 */
	stripRight?: boolean;
}
```

#### ApplySliceOptions

```ts
interface ApplySliceOptions {
	/** @default 1024 */
	verticalSlices?: number;
}
```

#### TextItemWithPosition

```ts
import type { TextItem } from 'unpdf/types/src/display/api';

type TextItemWithPosition = TextItem & {
	x: number;
	y: number;
};
```

#### Row

```ts
interface Row {
	page: number;
	rowNumber: number;
	y: number;
	xs: number[];
	items: TextItemWithPosition[];
}
```

## Contribution

This is a hobby project and your contributions are welcome.

If you would like to support this project please consider buying Tony a coffee.

<a href="https://www.buymeacoffee.com/tonyroberts" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Tony A Coffee" height="41" width="174"></a>

## License

Licensed under the [MIT License](https://raw.githubusercontent.com/tonyroberts/pdf2array/main/LICENSE).

## Support

No support is available for this project. You may raise pull requests and issues but no guarantee of a response is offered or should be assumed.
