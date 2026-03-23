import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

try {
    const parser = new pdfParse.PDFParse();
    console.log("PDFParse instance keys:", Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
} catch (e) {
    console.error(e);
}
