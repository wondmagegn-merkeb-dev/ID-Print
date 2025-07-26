
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  LoaderCircle,
  ScanLine,
  Trash2,
  XCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React, { useState } from 'react';
import { FileUploader } from './id-batcher/file-uploader';
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
  const { toast } = useToast();
  
  const [currentPage, setCurrentPage] = useState(1);
  const FILES_PER_PAGE = 5;

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
      const actualIndex = (currentPage - 1) * FILES_PER_PAGE + index;
      const removedFile = newFiles.splice(actualIndex, 1);
      URL.revokeObjectURL(removedFile[0].preview);
      
      const totalPages = Math.ceil(newFiles.length / FILES_PER_PAGE);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }

      return newFiles;
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please upload at least one PDF to process.',
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
      // setCredits(prev => prev - files.length); // Credits are managed in layout
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
    setCurrentPage(1);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const totalPages = Math.ceil(files.length / FILES_PER_PAGE);
  const paginatedFiles = files.slice(
    (currentPage - 1) * FILES_PER_PAGE,
    currentPage * FILES_PER_PAGE
  );

  return (
    <>
        {extractedData.length > 0 ? (
          <ImpositionPreview data={extractedData} onStartOver={handleStartOver} />
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary/90">
                ID Card Processing Made Easy
                </h1>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                Upload your ID PDFs to automatically format them for printing. Merge multiple IDs into a standardized A4 layout effortlessly.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <Card className="shadow-lg">
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

              <div className="space-y-4">
                  {files.length > 0 ? (
                      <>
                          <h2 className="text-xl font-semibold font-headline">Ready to Process ({files.length})</h2>
                          <ul className="space-y-3 min-h-[290px]">
                              {paginatedFiles.map((fileWithPreview, index) => (
                                  <li key={index} className="flex items-center justify-between p-3 bg-card rounded-lg shadow-sm border animate-in fade-in slide-in-from-bottom-2">
                                      <div className="flex items-center gap-4 overflow-hidden">
                                          <div className="w-10 h-10 flex items-center justify-center bg-muted rounded-md shrink-0">
                                              <FileText className="w-6 h-6 text-muted-foreground" />
                                          </div>
                                          <div className="overflow-hidden">
                                              <p className="font-medium text-sm truncate">{fileWithPreview.file.name}</p>
                                              <p className="text-xs text-muted-foreground">{formatBytes(fileWithPreview.file.size)}</p>
                                          </div>
                                      </div>
                                      <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={isProcessing}>
                                          <Trash2 className="w-4 h-4 text-destructive" />
                                      </Button>
                                  </li>
                              ))}
                          </ul>
                          {totalPages > 1 && (
                              <div className="flex justify-between items-center pt-2">
                                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
                                      <ChevronLeft className="mr-1 h-4 w-4" />
                                      Previous
                                  </Button>
                                  <span className="text-sm text-muted-foreground">
                                      Page {currentPage} of {totalPages}
                                  </span>
                                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
                                      Next
                                      <ChevronRight className="ml-1 h-4 w-4" />
                                  </Button>
                              </div>
                          )}
                      </>
                  ) : (
                      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                          <p className="text-muted-foreground">Uploaded files will appear here.</p>
                      </div>
                  )}
              </div>
            </div>


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
      </>
  );
}
