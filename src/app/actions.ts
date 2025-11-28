'use server';

import { generateResumeFeedback, type GenerateResumeFeedbackOutput } from '@/ai/flows/generate-resume-feedback';

export async function getResumeFeedback(resumeText: string): Promise<GenerateResumeFeedbackOutput> {
  if (!resumeText.trim() || resumeText.trim().length < 100) {
    throw new Error('Resume text must be at least 100 characters.');
  }

  try {
    const feedback = await generateResumeFeedback(resumeText);
    return feedback;
  } catch (error) {
    console.error('Error generating resume feedback:', error);
    throw new Error('Failed to get feedback from the AI. Please try again later.');
  }
}
