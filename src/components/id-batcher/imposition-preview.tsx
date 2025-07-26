
"use client";

import { Button } from '@/components/ui/button';
import { Download, Redo, Save } from 'lucide-react';
import { IdCardPreview } from './id-card-preview';
import React from 'react';
import type { IdData } from '@/ai/flow';
import { useToast } from '@/hooks/use-toast';

type ImpositionPreviewProps = {
  data: IdData[];
  onStartOver: () => void;
};

export function ImpositionPreview({ data, onStartOver }: ImpositionPreviewProps) {
  const { toast } = useToast();
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
          @page { size: A4 portrait; margin: 1cm; }
          body { font-family: sans-serif; }
          .page { width: 190mm; height: 277mm; page-break-after: always; display: flex; flex-direction: column; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10mm; flex-grow: 1; }
          .card-container { background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); color: #000; overflow: hidden; display: flex; flex-direction: column; height: 54mm; width: 85.6mm; }
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
      html += `<div class="page"><h2>Page ${pageIndex + 1}</h2><div class="grid">`;
      for (let i = 0; i < cardsPerPage; i++) {
        const cardDataItem = pageData[i];
        if (cardDataItem) {
          const escapedText = (cardDataItem.otherDetails || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          // Front
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">PDF Document (Front)</span></div>
            <div class="card-content">
              <div><p class="detail-label">File Name</p><p class="detail-value" style="word-break: break-all;">${cardDataItem.name || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
          // Back
          html += `<div class="card-container">
            <div class="card-header"><span class="card-title">Extracted Text (Back)</span></div>
            <div class="card-content">
              <div><p class="detail-label">Content</p><p class="detail-value">${escapedText || 'N/A'}</p></div>
            </div>
            <div class="card-footer"></div>
          </div>`;
        } else {
          html += '<div></div><div></div>'; // empty cells for both columns
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

  const handleSave = () => {
    if (data.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Cannot Save Empty Batch',
        description: 'There is no data to save.',
      });
      return;
    }

    try {
      const savedSessions = JSON.parse(localStorage.getItem('id-batcher-sessions') || '[]');
      const newSession = {
        id: new Date().toISOString(),
        timestamp: Date.now(),
        cardCount: cardData.length,
        data,
      };
      
      savedSessions.push(newSession);
      localStorage.setItem('id-batcher-sessions', JSON.stringify(savedSessions));

      toast({
        title: 'Batch Saved',
        description: `This batch of ${cardData.length} cards has been saved for 30 days.`,
      });
    } catch (error) {
      console.error('Failed to save session to localStorage:', error);
      toast({
        variant: 'destructive',
        title: 'Saving Failed',
        description: 'Could not save the batch to your browser storage.',
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary/90">Step 3: Preview & Export</h1>
          <p className="text-muted-foreground mt-1">
            Review the generated layout below. Each row contains the front and back of an ID.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStartOver}>
            <Redo /> Start Over
          </Button>
          <Button variant="secondary" onClick={handleSave}>
            <Save /> Save for 30 days
          </Button>
          <Button onClick={handleExport}>
            <Download /> Export to Word
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-muted/30 rounded-lg">
        <div id="preview-content" className="space-y-8 flex flex-col items-center">
            {pages.map((pageData, pageIndex) => (
            <div key={pageIndex} className="p-4 bg-white shadow-lg rounded-lg max-w-5xl">
                <h2 className="text-center font-bold mb-4 text-gray-600">
                Page {pageIndex + 1}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full max-w-4xl mx-auto">
                {Array.from({ length: cardsPerPage }).flatMap((_, i) =>
                    pageData[i] ? (
                    <React.Fragment key={`card-${i}`}>
                        <IdCardPreview data={pageData[i]} side="front" />
                        <IdCardPreview data={pageData[i]} side="back" />
                    </React.Fragment>
                    ) : (
                    <React.Fragment key={`empty-${i}`}>
                        <div className="bg-gray-100 rounded-lg border-dashed border-2 aspect-[85.6/54]"></div>
                        <div className="bg-gray-100 rounded-lg border-dashed border-2 aspect-[85.6/54]"></div>
                    </React.Fragment>
                    )
                )}
                </div>
            </div>
            ))}
            {pages.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No text could be extracted from the merged PDF.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
