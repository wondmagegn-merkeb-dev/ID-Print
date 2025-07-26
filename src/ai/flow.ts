'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DocumentDataSchema = z.object({
    name: z.string().describe('The full name of the person on the ID.'),
    dateOfBirth: z.string().describe('The date of birth of the person (e.g., YYYY-MM-DD). If not available, use "N/A".'),
    otherDetails: z.string().describe('Any other relevant details found on the document, concatenated into a single string.'),
});

const IdDataExtractionInputSchema = z.object({
  documentsText: z.string().describe('The combined text content of all uploaded documents.'),
});

const IdDataExtractionOutputSchema = z.object({
  documents: z.array(DocumentDataSchema).describe('An array of structured data for each identified ID document.'),
});

export type IdDataExtractionInput = z.infer<typeof IdDataExtractionInputSchema>;
export type IdDataExtractionOutput = z.infer<typeof IdDataExtractionOutputSchema>;

export async function extractIdData(input: IdDataExtractionInput): Promise<IdDataExtractionOutput> {
  return idExtractionFlow(input);
}

const idExtractionPrompt = ai.definePrompt({
  name: 'idExtractionPrompt',
  input: { schema: IdDataExtractionInputSchema },
  output: { schema: IdDataExtractionOutputSchema },
  prompt: `You are an expert at extracting information from ID documents.
You will be given the text content from one or more documents.
For each document, extract the person's full name, date of birth, and any other relevant text.
Compile all other text into the 'otherDetails' field.
If a piece of information is not available, use "N/A".
The documents are separated by '--- START OF [FILENAME] ---' and '--- END OF [FILENAME] ---'.

Document Texts:
{{{documentsText}}}
`,
});

const idExtractionFlow = ai.defineFlow(
  {
    name: 'idExtractionFlow',
    inputSchema: IdDataExtractionInputSchema,
    outputSchema: IdDataExtractionOutputSchema,
  },
  async (input) => {
    const { output } = await idExtractionPrompt(input);
    if (!output) {
        throw new Error("AI failed to return structured data.");
    }
    return output;
  }
);
