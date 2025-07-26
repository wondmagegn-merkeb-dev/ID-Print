'use server';

// This file is kept to avoid breaking imports, but AI functionality has been removed.
// You can re-implement AI data extraction here in the future if needed.

export type IdData = {
  name: string;
  dateOfBirth: string;
  otherDetails: string;
  fileName: string;
  rawText: string;
};
