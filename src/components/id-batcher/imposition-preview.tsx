
"use client";

import { Button } from '@/components/ui/button';
import { Download, Redo, Save } from 'lucide-react';
import { IdCardPreview } from './id-card-preview';
import React from 'react';
import type { IdData } from '@/ai/flow';
import { useToast } from '@/hooks/use-toast';
import { generateExportHtml } from '@/lib/export';

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

  let cardData: IdData[] = textChunks.map((chunk, index) => ({
    fileName: `ID ${index + 1}`,
    rawText: chunk,
    name: `ID ${index + 1} from Merged PDF`,
    dateOfBirth: 'N/A',
    otherDetails: chunk,
  }));

  // To better demonstrate multi-page layout, add placeholder cards if there aren't many.
  // We want to show at least, say, 10 cards to generate 3 pages.
  const minimumCardsForDemo = 10;
  if (cardData.length > 0 && cardData.length < minimumCardsForDemo) {
      const placeholdersNeeded = minimumCardsForDemo - cardData.length;
      for (let i = 0; i < placeholdersNeeded; i++) {
          const placeholderIndex = cardData.length + i + 1;
          cardData.push({
              fileName: `Placeholder ${placeholderIndex}`,
              rawText: 'This is placeholder text for layout demonstration purposes.',
              name: `Placeholder ID ${placeholderIndex}`,
              dateOfBirth: 'N/A',
              otherDetails: 'This is placeholder text for layout demonstration purposes. It will not be exported.',
          });
      }
  }


  const cardsPerPage = 4;
  const numPages = Math.ceil(cardData.length / cardsPerPage);

  const pages = Array.from({ length: numPages }, (_, i) => {
    const start = i * cardsPerPage;
    const end = start + cardsPerPage;
    return cardData.slice(start, end);
  });
  
  const handleExport = () => {
    // We only want to export the real data, not the placeholders.
    const exportableCardData = textChunks.map((chunk, index) => ({
        fileName: `ID ${index + 1}`,
        rawText: chunk,
        name: `ID ${index + 1} from Merged PDF`,
        dateOfBirth: 'N/A',
        otherDetails: chunk,
    }));
    
    if (exportableCardData.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data to Export",
            description: "There is no extracted content to export.",
        });
        return;
    }

    const htmlContent = generateExportHtml(exportableCardData);
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
    if (data.length === 0 || !data[0]?.rawText) {
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
        id: new Date().toISOString().slice(11, 23).replace('T', ''), // a short, unique ID
        timestamp: Date.now(),
        cardCount: textChunks.length, // Only count real cards
        data,
      };
      
      savedSessions.push(newSession);
      localStorage.setItem('id-batcher-sessions', JSON.stringify(savedSessions));

      toast({
        title: 'Batch Saved',
        description: `This batch of ${textChunks.length} cards has been saved for 30 days.`,
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
      <div className="flex-1 overflow-auto p-4 bg-muted/30 rounded-lg flex justify-center items-start">
        <div id="preview-content" className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center w-full max-w-5xl">
            {pages.map((pageData, pageIndex) => (
            <div key={pageIndex} className="p-4 bg-white shadow-lg rounded-lg w-full max-w-[210mm]">
                <h2 className="text-center font-bold mb-4 text-gray-600">
                Page {pageIndex + 1}
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 w-full mx-auto">
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
                <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No text could be extracted from the merged PDF.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
