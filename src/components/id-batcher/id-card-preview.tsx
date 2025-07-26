"use client";

import { UserSquare2 } from 'lucide-react';
import type { IdData } from '@/ai/flow';

type IdCardPreviewProps = {
  data: IdData;
  side: 'front' | 'back';
};

export function IdCardPreview({ data, side }: IdCardPreviewProps) {
  // Since we are no longer using AI, we will display the filename on the front
  // and the raw extracted text on the back.
  const frontText = data.name || 'N/A';
  const backText = data.otherDetails || 'N/A';

  return (
    <div className="aspect-[85.6/54] w-full bg-white rounded-lg shadow-md p-3 flex flex-col border text-black overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xs uppercase text-blue-800">
          {side === 'front' ? 'PDF Document' : 'Extracted Text'}
        </h3>
        <UserSquare2 className="w-4 h-4 text-blue-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center mt-2 text-sm overflow-y-auto">
        {side === 'front' ? (
          <>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">File Name</p>
              <p className="font-mono text-xs font-bold truncate">{frontText}</p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Content</p>
            <p className="font-mono text-xs whitespace-pre-wrap break-words">{backText}</p>
          </div>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-auto rounded-full"></div>
    </div>
  );
}
