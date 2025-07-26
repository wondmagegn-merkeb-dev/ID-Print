"use client";

import { FileUp } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

type FileUploaderProps = {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
};

export function FileUploader({ onFilesAdded, disabled }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    disabled
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer transition-colors duration-300',
        'hover:bg-accent/10 hover:border-accent',
        isDragActive && 'bg-accent/20 border-accent',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <FileUp className="w-12 h-12 text-primary" />
        {isDragActive ? (
          <p className="font-bold text-lg text-primary">Drop the PDFs here ...</p>
        ) : (
          <div>
            <p className="font-bold text-lg">Drag & drop your ID PDFs here, or click to select</p>
            <p className="text-sm mt-1">Supported format: PDF</p>
          </div>
        )}
      </div>
    </div>
  );
}
