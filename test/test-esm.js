import test from 'ava';
import { writeFile } from 'fs/promises';
import { statSync } from 'node:fs';
import { PdfConvert } from '../dist/index.js';

test('convert local pdf file', async (t) => {
  const pdfConverter = new PdfConvert('test/multipage.pdf');

  const pages = await pdfConverter.getPageCount();
  t.is(pages, 10);

  const buffer = await pdfConverter.convertPageToImage(1);
  t.truthy(buffer instanceof Buffer);

  await writeFile('test/page-local1.png', buffer);
  t.pass('write png');

  await pdfConverter.dispose();
  t.pass('disposed');
});

test('convert pdf file from remote', async (t) => {
  const pdfConverter = new PdfConvert(
    'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  );

  const pages = await pdfConverter.getPageCount();
  t.is(pages, 1, 'page count');

  const buffer = await pdfConverter.convertPageToImage(1);
  t.truthy(buffer instanceof Buffer);

  await writeFile('test/page-remote.png', buffer);
  t.pass('write pdf');

  await pdfConverter.dispose();
  t.pass('disposed');
});

test('shrink uncompressed pdf file with images', async (t) => {
  const pdfConverter = new PdfConvert('test/uncompressed-with-images.pdf');

  const buffer = await pdfConverter.shrink();
  t.truthy(buffer instanceof Buffer);

  await writeFile('test/shrunken.pdf', buffer);
  t.pass('write pdf');

  await pdfConverter.dispose();
  t.pass('disposed');

  const originalStats = statSync('test/uncompressed-with-images.pdf', {
    bigint: true,
  });
  const shrunkenStats = statSync('test/shrunken.pdf', { bigint: true });

  t.truthy(originalStats.size > shrunkenStats.size);
});

test('shrink uncompressed pdf file with options', async (t) => {
  const pdfConverter = new PdfConvert('test/uncompressed-with-images.pdf');

  const buffer = await pdfConverter.shrink({
    resolution: 72,
    pdfVersion: '1.4',
    greyScale: true
  });
  t.truthy(buffer instanceof Buffer);

  await writeFile('test/shrunken2.pdf', buffer);
  t.pass('write pdf');

  await pdfConverter.dispose();
  t.pass('disposed');

  const originalStats = statSync('test/uncompressed-with-images.pdf', {
    bigint: true,
  });
  const shrunkenStats = statSync('test/shrunken2.pdf', { bigint: true });

  t.truthy(originalStats.size > shrunkenStats.size);
});

test('get pdf version', async (t) => {
  const pdfConverter = new PdfConvert('test/multipage.pdf');

  const multiPageVersion = await pdfConverter.getPdfVersion();

  t.is(multiPageVersion, '1.4');

  await pdfConverter.dispose();

  const pdfConverter2 = new PdfConvert('test/uncompressed-with-images.pdf');

  const uncompressedVersion = await pdfConverter2.getPdfVersion();

  t.is(uncompressedVersion, '1.3');

  await pdfConverter2.dispose();
});
