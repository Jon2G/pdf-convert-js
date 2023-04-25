# pdf2png

This is a fork of [tr3ysmith/Pdf2Png](https://github.com/tr3ysmith/Pdf2Png).
Along with the usage of TypeScript and promises, this version:

- adds support to read PDF file from local file system
- properly compiles to both CommonJS and ESM
- get pdf version of files
- shrink pdf to compressed format

## Install

```bash
$ npm install @dcbeck/pdf-convert-js
```

## Setup

### Windows

No additional setup is needed for Windows, ghostscript is included with this package.

### Linux

If you want to use it with linux, you will need to install ghostscript via your package manager.

```bash
$ sudo apt-get update
$ sudo apt-get install ghostscript
```

### Mac OSX

You will need to install ghostscript on Mac using brew.

```bash
$ brew install ghostscript
```

## Usage

```typescript
import { PdfConvert, PdfConvertOptions } from '@brakebein/pdf2png';

// create a PdfConvert object for a PDF file
// using a Buffer
const pdfConverter = new PdfConvert(buffer);
// using a Web url
const pdfConverter = new PdfConvert('https://example.com/example.pdf');
// using a local file
const pdfConverter = new PdfConvert('./folder/example.pdf');

// pass options
const options: PdfConvertOptions = {
  // resolution of the output image in dpi

  // path to ghostscript bin directory (only Windows)
  // defaults to executable shipped with this package
  ghostscriptPath: 'path/to/gs/bin',
};
const pdfConverter = new PdfConvert('./folder/example.pdf', options);

// get the number of pages of the PDF
const pages = await pdfConverter.getPageCount();

// get page 1 as a PNG Image Buffer
const buffer = await pdfConverter.convertPageToImage(1);
await fs.writeFile('example_page1.png', buffer);

// get the pdf version of the PDF
const pdfVersion = await pdfConverter.getPdfVersion();

// compress / shrink the PDF with optional parameters
const shrunkenPDFBuffer = await pdfConverter.shrink({
  // down sampled resolution of the output pdf
  resolution: 72,
  // pdf version of the output pdf
  pdfVersion: '1.4',
  // set the output pdf to colored or grey scaled
  greyScale: false,
});
await fs.writeFile('shrunken.pdf', shrunkenPDFBuffer);

// Dispose the converter object when you're done using it,
// otherwise the pdf tmp file will not be removed
// (but should be automatically removed on process exit).
// To manually call `dispose()` allows you to run multiple operations
// within long-living processes, e.g. backend server, without piling up tmp files.
pdfConverter.dispose();
```
