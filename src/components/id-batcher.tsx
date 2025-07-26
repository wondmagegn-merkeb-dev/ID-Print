
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
  ChevronRight,
  FileSignature,
  FolderClock,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FileUploader } from './id-batcher/file-uploader';
import { ImpositionPreview } from './id-batcher/imposition-preview';
import type { IdData } from '@/ai/flow';
import { processFiles, FileInput, mergePdfs } from '@/app/actions';
import { MergedPdfPreview } from './id-batcher/merged-pdf-preview';
import Link from 'next/link';

type FileWithPreview = {
  file: File;
  preview: string;
};

type Step = 'upload' | 'preview_merged' | 'preview_ids';

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // remove the "data:mime/type;base64," prefix
            resolve(result.split(',')[1]);
        };
        reader.onerror = (error) => reject(error);
    });
}

function UploadStep({ 
  onMerge, 
  isProcessing,
}: { 
  onMerge: (files: FileWithPreview[]) => Promise<void>; 
  isProcessing: boolean;
}) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
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
  
  const handleMergeClick = async () => {
    if (files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No files selected',
        description: 'Please upload at least one PDF to merge.',
      });
      return;
    }
    await onMerge(files);
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
            </CardContent>
          </Card>

          <div className="space-y-4">
              {files.length > 0 ? (
                  <>
                      <h2 className="text-xl font-semibold font-headline">Ready to Merge ({files.length})</h2>
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

        <div className="mt-8 flex justify-center gap-4">
            <Button onClick={handleMergeClick} disabled={isProcessing || files.length === 0} size="lg">
              {isProcessing ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Merging...
                </>
              ) : (
                <>
                  <FileSignature />
                  Merge {files.length > 0 ? `${files.length} PDF(s)` : 'PDFs'}
                </>
              )}
            </Button>
        </div>
      </div>
  )
}

export function IdBatcher() {
  const [step, setStep] = useState<Step>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [mergedPdf, setMergedPdf] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<IdData[]>([]);

  useEffect(() => {
    // Check for a session to load when the component mounts
    try {
      const sessionToLoad = localStorage.getItem('id-batcher-load-session');
      if (sessionToLoad) {
        const data: IdData[] = JSON.parse(sessionToLoad);
        // Clear the item so it doesn't load again on refresh
        localStorage.removeItem('id-batcher-load-session');
        handleLoadSession(data);
      }
    } catch (e) {
      console.error('Failed to load session from localStorage:', e);
      localStorage.removeItem('id-batcher-load-session');
    }
  }, []); // Empty dependency array means this runs once on mount


  const handleMerge = async (files: FileWithPreview[]) => {
    setIsProcessing(true);
    setError(null);
    try {
        const fileInputs: FileInput[] = await Promise.all(
            files.map(async (fileWithPreview) => {
                const { file } = fileWithPreview;
                const base64Data = await fileToBase64(file);
                return {
                    name: file.name,
                    type: file.type,
                    base64Data,
                };
            })
        );
        
        const mergedPdfBase64 = await mergePdfs(fileInputs);
        setMergedPdf(mergedPdfBase64);
        setStep('preview_merged');

    } catch (e) {
      const error = e as Error;
      toast({
        variant: 'destructive',
        title: 'Merging Error',
        description: error.message || 'Could not merge PDFs.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateIds = async () => {
    if (!mergedPdf) {
        toast({
            variant: 'destructive',
            title: 'No merged PDF',
            description: 'Something went wrong, please start over.',
        });
        return;
    }
    setIsProcessing(true);
    setError(null);
    try {
        const fileInput: FileInput = {
            name: 'merged.pdf',
            type: 'application/pdf',
            base64Data: mergedPdf,
        };
        const data = await processFiles([fileInput]);
        setExtractedData(data);
        setStep('preview_ids');
    } catch (e) {
        const error = e as Error;
        setError(error.message || 'An error occurred during processing.');
        toast({
            variant: 'destructive',
            title: 'Processing Error',
            description: error.message || 'Could not process the merged file.',
        });
    } finally {
        setIsProcessing(false);
    }
  }

  const handleStartOver = () => {
    setStep('upload');
    setMergedPdf(null);
    setExtractedData([]);
    setError(null);
    setIsProcessing(false);
  };

  const handleLoadSession = (data: IdData[]) => {
    setExtractedData(data);
    setStep('preview_ids');
    toast({
      title: 'Session Loaded',
      description: 'The saved ID batch has been loaded.',
    });
  };
  
  const renderStep = () => {
    switch(step) {
      case 'upload':
        return <UploadStep onMerge={handleMerge} isProcessing={isProcessing} />;
      case 'preview_merged':
        if (!mergedPdf) return null;
        return <MergedPdfPreview pdfBase64={mergedPdf} onGenerate={handleGenerateIds} onStartOver={handleStartOver} isProcessing={isProcessing} />;
      case 'preview_ids':
        return <ImpositionPreview data={extractedData} onStartOver={handleStartOver} />;
      default:
        return <UploadStep onMerge={handleMerge} isProcessing={isProcessing} />;
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 flex items-center gap-2 text-destructive text-sm font-medium bg-destructive/10 p-3 rounded-md">
          <XCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      )}
      {renderStep()}
    </>
  );
}
