'use server';

import { generateResumeFeedback, type GenerateResumeFeedbackOutput } from '@/ai/flows/generate-resume-feedback';
import mammoth from 'mammoth';
import pdf from 'pdf-parse';

async function getTextFromDocx(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  return value;
}

async function getTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  return data.text;
}

export async function getResumeFeedback(fileData: { fileContent: string; fileType: string }): Promise<GenerateResumeFeedbackOutput> {
  const { fileContent, fileType } = fileData;

  if (!fileContent) {
    throw new Error('The provided resume content is empty.');
  }

  const buffer = Buffer.from(fileContent, 'base64');
  let resumeText = '';

  try {
    if (fileType === 'application/pdf') {
      resumeText = await getTextFromPdf(buffer);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      resumeText = await getTextFromDocx(buffer);
    } else {
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error('Failed to read the content of the resume file.');
  }

  if (!resumeText.trim() || resumeText.trim().length < 100) {
    throw new Error('Extracted resume text must be at least 100 characters for a meaningful analysis. The file might be empty, corrupted, or password-protected.');
  }

  try {
    const feedback = await generateResumeFeedback(resumeText);
    return feedback;
  } catch (error) {
    console.error('Error generating resume feedback:', error);
    throw new Error('Failed to get feedback from the AI. Please try again later.');
  }
}
