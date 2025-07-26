'use server';

import { extractIdData } from '@/ai/flow';
import { PDFExtract } from 'pdf.js-extract';

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

export async function processFiles(files: FileInput[]) {
  const extractionPromises = files.map(async (file) => {
    if (file.type === 'application/pdf') {
      try {
        const textContent = await extractTextFromPdf(file.base64Data);
        return {
          fileName: file.name,
          textContent: textContent,
        };
      } catch (e) {
        console.error(`Error processing ${file.name}:`, e);
        return {
          fileName: file.name,
          textContent: 'Error extracting text.',
        };
      }
    }
    // This case should ideally not be hit if the frontend filters correctly.
    return {
      fileName: file.name,
      textContent: 'Unsupported file type.',
    };
  });

  const extractedContents = await Promise.all(extractionPromises);
  
  // Now, pass the concatenated text of all documents to the AI flow.
  const allText = extractedContents.map(c => `--- START OF ${c.fileName} ---\n${c.textContent}\n--- END OF ${c.fileName} ---`).join('\n\n');
  
  try {
    const structuredData = await extractIdData({ documentsText: allText });
    return structuredData.documents;
  } catch (error) {
    console.error("Error processing documents with AI:", error);
    throw new Error("Failed to process documents with AI.");
  }
}
