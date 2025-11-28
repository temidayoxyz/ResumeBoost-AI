'use server';

/**
 * @fileOverview A Genkit flow for suggesting skill improvements based on resume analysis.
 *
 * - suggestSkillImprovements - A function that takes resume text as input and returns skill improvement suggestions.
 * - SuggestSkillImprovementsInput - The input type for the suggestSkillImprovements function.
 * - SuggestSkillImprovementsOutput - The return type for the suggestSkillImprovements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSkillImprovementsInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to analyze.'),
});
export type SuggestSkillImprovementsInput = z.infer<typeof SuggestSkillImprovementsInputSchema>;

const SuggestSkillImprovementsOutputSchema = z.object({
  skillImprovements: z
    .string()
    .describe('Specific, targeted suggestions for improving skills based on the resume analysis.'),
});
export type SuggestSkillImprovementsOutput = z.infer<typeof SuggestSkillImprovementsOutputSchema>;

export async function suggestSkillImprovements(
  input: SuggestSkillImprovementsInput
): Promise<SuggestSkillImprovementsOutput> {
  return suggestSkillImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillImprovementsPrompt',
  input: {schema: SuggestSkillImprovementsInputSchema},
  output: {schema: SuggestSkillImprovementsOutputSchema},
  prompt: `Analyze the following resume text and provide specific, actionable suggestions for skill improvements.

Resume Text:
{{{resumeText}}}

Focus on identifying skill gaps and suggesting concrete steps the user can take to enhance their resume and appeal to potential employers.`,
});

const suggestSkillImprovementsFlow = ai.defineFlow(
  {
    name: 'suggestSkillImprovementsFlow',
    inputSchema: SuggestSkillImprovementsInputSchema,
    outputSchema: SuggestSkillImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
