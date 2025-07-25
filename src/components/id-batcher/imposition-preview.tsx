"use client";

import type { ExtractIdDataOutput } from '@/ai/flows/extract-id-data';
import { Button } from '@/components/ui/button';
import { Download, Redo } from 'lucide-react';
import { IdCardPreview } from './id-card-preview';

type ImpositionPreviewProps = {
  data: ExtractIdDataOutput[];
  onStartOver: () => void;
};

export function ImpositionPreview({ data, onStartOver }: ImpositionPreviewProps) {
  const cardsPerPage = 4;
  const numPages = Math.ceil(data.length / cardsPerPage);

  const pages = Array.from({ length: numPages }, (_, i) => {
    const start = i * cardsPerPage;
    const end = start + cardsPerPage;
    return data.slice(start, end);
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
          .card-container { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #000; }
          .card-header { display: flex; justify-content: space-between; align-items: center; }
          .card-title { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #1e3a8a; }
          .card-content { margin-top: 8px; font-size: 12px; }
          .detail-label { font-size: 8px; color: #6b7280; text-transform: uppercase; font-weight: 600; }
          .detail-value { font-family: monospace; font-size: 10px; font-weight: bold; word-wrap: break-word; }
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
        const cardData = pageData[i];
        if (cardData) {
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">Official ID Document</span></div>
            <div class="card-content">
              <div><p class="detail-label">Name</p><p class="detail-value">${cardData.name || 'N/A'}</p></div>
              <div style="margin-top: 8px;"><p class="detail-label">Date of Birth</p><p class="detail-value">${cardData.dateOfBirth || 'N/A'}</p></div>
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
        const cardData = pageData[i];
        if (cardData) {
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">Additional Details</span></div>
            <div class="card-content">
              <div><p class="detail-label">Other Details</p><p class="detail-value">${cardData.otherDetails || 'N/A'}</p></div>
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
          <h1 className="font-headline text-4xl font-bold text-primary/90">Preview & Export</h1>
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
      </div>
    </div>
  );
}
