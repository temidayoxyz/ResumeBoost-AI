'use client';
import { useState } from 'react';
import type { GenerateResumeFeedbackOutput } from '@/ai/flows/generate-resume-feedback';
import { getResumeFeedback } from '@/app/actions';
import AppHeader from '@/components/app-header';
import FeedbackDisplay from '@/components/feedback-display';
import ResumeForm from '@/components/resume-form';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [feedback, setFeedback] = useState<GenerateResumeFeedbackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async (data: { resume: string }) => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    
    try {
      // In a real app, you might upload the file here and pass a file ID
      // to the server action. For this prototype, we're passing the
      // (simulated) text content directly.
      const result = await getResumeFeedback(data.resume);
      setFeedback(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <ResumeForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          <FeedbackDisplay feedback={feedback} isLoading={isLoading} error={error} />
        </div>
      </main>
    </div>
  );
}
