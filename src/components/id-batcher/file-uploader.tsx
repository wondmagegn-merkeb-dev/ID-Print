"use client";

import { FileUp } from 'lucide-react';
import React, { useCallback, useState } from 'react';
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
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
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
          <p className="font-bold text-lg text-primary">Drop the files here ...</p>
        ) : (
          <div>
            <p className="font-bold text-lg">Drag & drop ID images here, or click to select</p>
            <p className="text-sm mt-1">Supported formats: PNG, JPG, WEBP</p>
          </div>
        )}
      </div>
    </div>
  );
}
