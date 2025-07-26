"use client";

import { Button } from '@/components/ui/button';
import { Download, Redo } from 'lucide-react';
import { IdCardPreview } from './id-card-preview';
import React from 'react';
import type { IdData } from '@/ai/flow';

type ImpositionPreviewProps = {
  data: IdData[];
  onStartOver: () => void;
};

export function ImpositionPreview({ data, onStartOver }: ImpositionPreviewProps) {
  // Since we process a single merged PDF, we'll take the first data element
  // which contains all the text and split it to simulate multiple cards.
  const allText = data[0]?.rawText || "";
  const textChunks = allText.split(/\s*\n\s*\n\s*/).filter(Boolean); // Split by blank lines

  const cardData: IdData[] = textChunks.map((chunk, index) => ({
    fileName: `ID ${index + 1}`,
    rawText: chunk,
    name: `ID ${index + 1} from Merged PDF`,
    dateOfBirth: 'N/A',
    otherDetails: chunk,
  }));

  const cardsPerPage = 4;
  const numPages = Math.ceil(cardData.length / cardsPerPage);

  const pages = Array.from({ length: numPages }, (_, i) => {
    const start = i * cardsPerPage;
    const end = start + cardsPerPage;
    return cardData.slice(start, end);
  });

  const generateExportHtml = () => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>ID Batcher Export</title>
        <style>
          @page { size: A4; margin: 1cm; }
          body { font-family: sans-serif; }
          .page { width: 180mm; height: 277mm; page-break-after: always; display: flex; flex-direction: column; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 10mm; flex-grow: 1; }
          .card-container { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #000; overflow: hidden; display: flex; flex-direction: column; }
          .card-header { display: flex; justify-content: space-between; align-items: center; }
          .card-title { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #1e3a8a; }
          .card-content { margin-top: 8px; font-size: 10px; flex-grow: 1; overflow: hidden; }
          .detail-label { font-size: 8px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
          .detail-value { font-family: monospace; font-size: 10px; font-weight: bold; white-space: pre-wrap; word-wrap: break-word; }
          .card-footer { height: 4px; background: linear-gradient(to right, #3b82f6, #8b5cf6); border-radius: 9999px; margin-top: auto; }
          h2 { font-family: 'Space Grotesk', sans-serif; text-align: center; }
        </style>
      </head>
      <body>
    `;

    pages.forEach((pageData, pageIndex) => {
      // Fronts page
      html += `<div class="page"><h2>Page ${pageIndex * 2 + 1} - Fronts</h2><div class="grid">`;
      for (let i = 0; i < 4; i++) {
        const cardDataItem = pageData[i];
        if (cardDataItem) {
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">PDF Document</span></div>
            <div class="card-content">
              <div><p class="detail-label">File Name</p><p class="detail-value" style="word-break: break-all;">${cardDataItem.name || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
        } else {
          html += '<div></div>'; // empty cell
        }
      }
      html += `</div></div>`;

      // Backs page
      html += `<div class="page"><h2>Page ${pageIndex * 2 + 2} - Backs</h2><div class="grid">`;
      for (let i = 0; i < 4; i++) {
        const cardDataItem = pageData[i];
        if (cardDataItem) {
          // Escape HTML characters from the raw text to prevent issues in the export
          const escapedText = (cardDataItem.otherDetails || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">Extracted Text</span></div>
            <div class="card-content">
              <div><p class="detail-label">Content</p><p class="detail-value">${escapedText || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
        } else {
          html += '<div></div>'; // empty cell
        }
      }
      html += `</div></div>`;
    });

    html += '</body></html>';
    return html;
  };

  const handleExport = () => {
    const htmlContent = generateExportHtml();
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'id_batch_export.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary/90">Step 3: Preview & Export</h1>
          <p className="text-muted-foreground mt-1">
            Review the generated layout below. You can export the result as a Word document.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStartOver}>
            <Redo /> Start Over
          </Button>
          <Button onClick={handleExport}>
            <Download /> Export to Word
          </Button>
        </div>
      </div>
      <div id="preview-content" className="space-y-8">
        {pages.map((pageData, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {/* Fronts */}
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-center font-bold mb-4 text-gray-600">
                Page {pageIndex * 2 + 1} - Fronts
              </h2>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 aspect-[1/1.414] w-full max-w-4xl mx-auto">
                {Array.from({ length: 4 }).map((_, i) =>
                  pageData[i] ? (
                    <IdCardPreview key={`front-${i}`} data={pageData[i]} side="front" />
                  ) : (
                    <div key={`front-empty-${i}`} className="bg-gray-100 rounded-lg border-dashed border-2"></div>
                  )
                )}
              </div>
            </div>
            {/* Backs */}
            <div className="p-4 bg-white shadow-lg rounded-lg">
              <h2 className="text-center font-bold mb-4 text-gray-600">
                Page {pageIndex * 2 + 2} - Backs
              </h2>
              <div className="grid grid-cols-2 grid-rows-2 gap-4 aspect-[1/1.414] w-full max-w-4xl mx-auto">
                {Array.from({ length: 4 }).map((_, i) =>
                  pageData[i] ? (
                    <IdCardPreview key={`back-${i}`} data={pageData[i]} side="back" />
                  ) : (
                    <div key={`back-empty-${i}`} className="bg-gray-100 rounded-lg border-dashed border-2"></div>
                  )
                )}
              </div>
            </div>
          </React.Fragment>
        ))}
        {pages.length === 0 && (
            <div className="text-center py-12">
                <p className="text-muted-foreground">No text could be extracted from the merged PDF.</p>
            </div>
        )}
      </div>
    </div>
  );
}
