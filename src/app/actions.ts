'use server';

import { PDFExtract } from 'pdf.js-extract';

export async function extractTextFromPdf(base64Data: string) {
  const fileBuffer = Buffer.from(base64Data, 'base64');
  const pdfExtractor = new PDFExtract();
  try {
    const data = await pdfExtractor.extract(fileBuffer, {});
    return data.pages.map(page => page.content.map(c => c.str).join(' ')).join('\n\n');
  } catch (error) {
    console.error('Error extracting PDF on server:', error);
    throw new Error('Failed to extract text from PDF.');
  }
}
