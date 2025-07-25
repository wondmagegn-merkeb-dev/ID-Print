"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  FileUp,
  LoaderCircle,
  ScanLine,
  Trash2,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { FileUploader } from './id-batcher/file-uploader';
import { Header } from './id-batcher/header';
import { ImpositionPreview, IdData } from './id-batcher/imposition-preview';
import { extractTextFromPdf } from '@/app/actions';

type FileWithPreview = {
  file: File;
  preview: string;
};

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function IdBatcher() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [extractedData, setExtractedData] = useState<IdData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(100);
  const { toast } = useToast();

  const handleFiles = (newFiles: File[]) => {
    const newFilesWithPreview = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFiles(prevFiles => [...prevFiles, ...newFilesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      const removedFile = newFiles.splice(index, 1);
      URL.revokeObjectURL(removedFile[0].preview);
      return newFiles;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please upload at least one ID image or PDF to process.',
      });
      return;
    }

    if (files.length > credits) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Credits',
        description: `You need ${files.length} credits but only have ${credits}.`,
      });
      return;
    }

    setIsProcessing(true);
    setError(null);

    const dataPromises = files.map(async (fileWithPreview) => {
      const { file } = fileWithPreview;
      const fileName = file.name;
      const name = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

      let otherDetails = 'Placeholder details for non-PDF file.';
      
      if (file.type === 'application/pdf') {
        try {
          const buffer = await file.arrayBuffer();
          const base64Data = arrayBufferToBase64(buffer);
          const data = await extractTextFromPdf(base64Data);
          otherDetails = data;
        } catch (e) {
          console.error('Error extracting PDF:', e);
          otherDetails = 'Could not extract text from PDF.';
        }
      }

      return {
        name: name.replace(/[-_]/g, ' '),
        dateOfBirth: 'N/A',
        otherDetails: otherDetails || "No content found in PDF.",
      };
    });

    try {
      const data = await Promise.all(dataPromises);
      setExtractedData(data);
      setCredits(prev => prev - files.length);
      setFiles([]); // Clear files after processing
    } catch (e) {
      setError('An error occurred during processing.');
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: 'Could not process all files.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOver = () => {
    setExtractedData([]);
    setFiles([]);
    setError(null);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <Header credits={credits} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {extractedData.length > 0 ? (
          <ImpositionPreview data={extractedData} onStartOver={handleStartOver} />
        ) : (
          <div className="max-w-4xl mx-auto">
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-center text-primary/90">
              ID Card Processing Made Easy
            </h1>
            <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
              Upload ID images (PNG, JPG) or PDFs to automatically format them for printing. Merge multiple IDs into a standardized A4 layout effortlessly.
            </p>
            <Card className="mt-8 shadow-lg">
              <CardContent className="p-6">
                <FileUploader onFilesAdded={handleFiles} disabled={isProcessing} />

                {error && (
                  <div className="mt-4 flex items-center gap-2 text-destructive text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    <p>{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {files.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold font-headline">Ready to Process</h2>
                <ul className="mt-4 space-y-3">
                  {files.map((fileWithPreview, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-card rounded-lg shadow-sm">
                      <div className="flex items-center gap-4">
                        {fileWithPreview.file.type.startsWith('image/') ? (
                           <img src={fileWithPreview.preview} alt={fileWithPreview.file.name} className="w-16 h-10 object-cover rounded-md" />
                        ) : (
                          <div className="w-16 h-10 flex items-center justify-center bg-muted rounded-md">
                            <FileUp className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">{fileWithPreview.file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatBytes(fileWithPreview.file.size)}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isProcessing}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Button onClick={handleProcess} disabled={isProcessing || files.length === 0} size="lg">
                {isProcessing ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ScanLine />
                    Process {files.length > 0 ? `${files.length} file(s)` : 'Files'}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
