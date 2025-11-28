'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating feedback on a resume.
 *
 * The flow takes resume text as input and returns AI-generated feedback, skill improvement suggestions,
 * and a readability score.
 *
 * @interface GenerateResumeFeedbackInput - The input schema for the flow.
 * @interface GenerateResumeFeedbackOutput - The output schema for the flow.
 * @function generateResumeFeedback - The main function to trigger the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeFeedbackInputSchema = z.string().describe('The text content of the resume file to analyze.');
export type GenerateResumeFeedbackInput = z.infer<typeof GenerateResumeFeedbackInputSchema>;

const GenerateResumeFeedbackOutputSchema = z.object({
  feedback: z.string().describe('AI-generated feedback on the resume.'),
  skillSuggestions: z.string().describe('Specific, targeted suggestions for improving skills based on the resume analysis.'),
  readabilityScore: z.number().describe('A numerical score representing the readability of the resume.'),
});
export type GenerateResumeFeedbackOutput = z.infer<typeof GenerateResumeFeedbackOutputSchema>;

export async function generateResumeFeedback(resumeText: GenerateResumeFeedbackInput): Promise<GenerateResumeFeedbackOutput> {
  return generateResumeFeedbackFlow(resumeText);
}

const resumeFeedbackPrompt = ai.definePrompt({
  name: 'resumeFeedbackPrompt',
  input: {schema: GenerateResumeFeedbackInputSchema},
  output: {schema: GenerateResumeFeedbackOutputSchema},
  prompt: `You are an expert resume reviewer. Analyze the following resume content and provide feedback on its strengths and weaknesses, suggest specific skill improvements, and calculate a readability score.

Resume Content:
{{resumeText}}

Provide your feedback in a structured format.
`,
});

const generateResumeFeedbackFlow = ai.defineFlow(
  {
    name: 'generateResumeFeedbackFlow',
    inputSchema: GenerateResumeFeedbackInputSchema,
    outputSchema: GenerateResumeFeedbackOutputSchema,
  },
  async resumeText => {
    const {output} = await resumeFeedbackPrompt(resumeText);
    return output!;
  }
);
