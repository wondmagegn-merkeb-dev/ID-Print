'use server';

/**
 * @fileOverview A flow for extracting ID data from an image.
 *
 * - extractIdData - A function that handles the ID data extraction process.
 * - ExtractIdDataInput - The input type for the extractIdData function.
 * - ExtractIdDataOutput - The return type for the extractIdData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractIdDataInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of an ID card, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractIdDataInput = z.infer<typeof ExtractIdDataInputSchema>;

const ExtractIdDataOutputSchema = z.object({
  name: z.string().describe('The name extracted from the ID card.'),
  dateOfBirth: z.string().describe('The date of birth extracted from the ID card.'),
  otherDetails: z.string().describe('Other relevant details extracted from the ID card.'),
});
export type ExtractIdDataOutput = z.infer<typeof ExtractIdDataOutputSchema>;

export async function extractIdData(input: ExtractIdDataInput): Promise<ExtractIdDataOutput> {
  return extractIdDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractIdDataPrompt',
  input: {schema: ExtractIdDataInputSchema},
  output: {schema: ExtractIdDataOutputSchema},
  prompt: `You are an expert data extraction specialist, skilled at extracting information from ID cards.

You will use OCR to read the ID card image and extract the following information:
- Name
- Date of Birth
- Other relevant details

Return the extracted information in JSON format.

ID Card Image: {{media url=photoDataUri}}`,
});

const extractIdDataFlow = ai.defineFlow(
  {
    name: 'extractIdDataFlow',
    inputSchema: ExtractIdDataInputSchema,
    outputSchema: ExtractIdDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
