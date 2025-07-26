
"use client";

import { Button } from '@/components/ui/button';
import { LoaderCircle, Redo, ScanLine } from 'lucide-react';
import React from 'react';

type MergedPdfPreviewProps = {
  pdfBase64: string;
  onGenerate: () => void;
  onStartOver: () => void;
  isProcessing: boolean;
};

export function MergedPdfPreview({ pdfBase64, onGenerate, onStartOver, isProcessing }: MergedPdfPreviewProps) {
  const pdfDataUrl = `data:application/pdf;base64,${pdfBase64}`;

  return (
    <div className="flex flex-col h-[calc(100vh-90px)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-2 gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold text-primary/90">Step 2: Review Merged PDF</h1>
          <p className="text-muted-foreground mt-1">
            All your uploaded PDFs have been merged into a single document. Review it below.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onStartOver} disabled={isProcessing}>
            <Redo /> Start Over
          </Button>
          <Button onClick={onGenerate} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <LoaderCircle className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ScanLine />
                Generate IDs
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="shadow-lg rounded-lg p-4 flex-1">
        <div className="w-full h-full max-w-4xl mx-auto">
          <iframe
            src={pdfDataUrl}
            className="w-full h-full border rounded-md"
            title="Merged PDF Preview"
          />
        </div>
      </div>
    </div>
  );
}
