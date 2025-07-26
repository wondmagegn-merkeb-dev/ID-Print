'use server';

import * as pdfjs from 'pdfjs-dist/legacy/build/pdf';
import type { TextItem } from 'pdfjs-dist/types/src/display/api';
import type { IdData } from '@/ai/flow';
import { PDFDocument } from 'pdf-lib';

// Required for pdfjs-dist to work on the server
if (!pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@^4.5.136/build/pdf.worker.min.mjs`;
}


export type FileInput = {
  name: string;
  type: string;
  base64Data: string;
};

export async function mergePdfs(files: FileInput[]): Promise<string> {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        if (file.type === 'application/pdf') {
            const pdfBytes = Buffer.from(file.base64Data, 'base64');
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
            });
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    return Buffer.from(mergedPdfBytes).toString('base64');
}


async function extractTextFromPdf(base64Data: string): Promise<string> {
    const fileBuffer = Buffer.from(base64Data, 'base64');
    try {
        const loadingTask = pdfjs.getDocument(fileBuffer);
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => (item as TextItem).str).join(' ');
            fullText += pageText + '\n\n';
        }
        return fullText;

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
