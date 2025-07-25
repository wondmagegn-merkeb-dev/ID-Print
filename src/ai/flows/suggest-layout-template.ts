'use server';

/**
 * @fileOverview An AI agent that suggests a suitable layout template based on the extracted ID information and the type of ID.
 *
 * - suggestLayoutTemplate - A function that suggests a layout template.
 * - SuggestLayoutTemplateInput - The input type for the suggestLayoutTemplate function.
 * - SuggestLayoutTemplateOutput - The return type for the suggestLayoutTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLayoutTemplateInputSchema = z.object({
  extractedIdData: z
    .string()
    .describe('The extracted data from the ID card (name, date of birth, etc.).'),
  idType: z.string().describe('The type of ID card (e.g., driver license, passport).'),
});
export type SuggestLayoutTemplateInput = z.infer<typeof SuggestLayoutTemplateInputSchema>;

const SuggestLayoutTemplateOutputSchema = z.object({
  templateSuggestion: z
    .string()
    .describe(
      'A suggestion for a suitable layout template name based on the extracted ID data and ID type.'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested template, explaining why it is suitable for the given ID data and type.'
    ),
});
export type SuggestLayoutTemplateOutput = z.infer<typeof SuggestLayoutTemplateOutputSchema>;

export async function suggestLayoutTemplate(
  input: SuggestLayoutTemplateInput
): Promise<SuggestLayoutTemplateOutput> {
  return suggestLayoutTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLayoutTemplatePrompt',
  input: {schema: SuggestLayoutTemplateInputSchema},
  output: {schema: SuggestLayoutTemplateOutputSchema},
  prompt: `You are an expert in document layout and design. Given the extracted data from an ID card and the type of ID, you will suggest a suitable layout template for generating a well-formatted output document.

Extracted ID Data: {{{extractedIdData}}}
ID Type: {{{idType}}}

Consider factors such as the common fields present in the ID data, the visual characteristics of the ID type, and the overall goal of creating a clear and professional document.

Suggest a template name and provide a brief explanation of why it is suitable. The template name should be simple and descriptive.

Example:
{
  "templateSuggestion": "modern-id-template",
  "reasoning": "This template uses a clean, modern design with clear sections for each data field, making it easy to read and visually appealing for a general ID card."
}

Output in JSON format:
`,
});

const suggestLayoutTemplateFlow = ai.defineFlow(
  {
    name: 'suggestLayoutTemplateFlow',
    inputSchema: SuggestLayoutTemplateInputSchema,
    outputSchema: SuggestLayoutTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
