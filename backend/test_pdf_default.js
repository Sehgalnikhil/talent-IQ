import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfObj1 = require('pdf-parse');

console.log("pdfParse default type:", typeof pdfObj1.default);
console.log("pdfParse object:", pdfObj1);
