'use server';

import { PDFExtract } from 'pdf.js-extract';
import type { IdData } from '@/ai/flow';

export type FileInput = {
  name: string;
  type: string;
  base64Data: string;
};

async function extractTextFromPdf(base64Data: string): Promise<string> {
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

export async function processFiles(files: FileInput[]): Promise<IdData[]> {
  const extractionPromises = files.map(async (file) => {
    if (file.type === 'application/pdf') {
      try {
        const textContent = await extractTextFromPdf(file.base64Data);
        // Without AI, we can't reliably extract specific fields.
        // We'll return the raw text and some placeholders.
        return {
          fileName: file.name,
          rawText: textContent,
          name: file.name, // Using filename as a placeholder for name
          dateOfBirth: 'N/A',
          otherDetails: textContent, // Put all extracted text here
        };
      } catch (e) {
        console.error(`Error processing ${file.name}:`, e);
        return {
          fileName: file.name,
          rawText: 'Error extracting text.',
          name: file.name,
          dateOfBirth: 'N/A',
          otherDetails: 'Error extracting text.',
        };
      }
    }
    // This case should ideally not be hit if the frontend filters correctly.
    return {
      fileName: file.name,
      rawText: 'Unsupported file type.',
      name: file.name,
      dateOfBirth: 'N/A',
      otherDetails: 'Unsupported file type.',
    };
  });

  const extractedData = await Promise.all(extractionPromises);
  return extractedData;
}
