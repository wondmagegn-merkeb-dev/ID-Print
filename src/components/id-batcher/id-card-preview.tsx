"use client";

import { UserSquare2 } from 'lucide-react';
import { IdData } from './imposition-preview';

type IdCardPreviewProps = {
  data: IdData;
  side: 'front' | 'back';
};

export function IdCardPreview({ data, side }: IdCardPreviewProps) {
  return (
    <div className="aspect-[85.6/54] w-full bg-white rounded-lg shadow-md p-3 flex flex-col border text-black overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-xs uppercase text-blue-800">
          {side === 'front' ? 'Official ID Document' : 'Additional Details'}
        </h3>
        <UserSquare2 className="w-4 h-4 text-blue-600" />
      </div>

      <div className="flex-1 flex flex-col justify-center mt-2 text-sm">
        {side === 'front' ? (
          <>
            <div>
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Name</p>
              <p className="font-mono text-xs font-bold truncate">{data.name || 'N/A'}</p>
            </div>
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase font-semibold">Date of Birth</p>
              <p className="font-mono text-xs font-bold">{data.dateOfBirth || 'N/A'}</p>
            </div>
          </>
        ) : (
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold">Other Details</p>
            <p className="font-mono text-xs font-bold break-words">{data.otherDetails || 'N/A'}</p>
          </div>
        )}
      </div>

      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mt-auto rounded-full"></div>
    </div>
  );
}
