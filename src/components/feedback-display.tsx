'use client';
import type { GenerateResumeFeedbackOutput } from '@/ai/flows/generate-resume-feedback';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bot, BrainCircuit, FileText } from 'lucide-react';
import { ReadabilityScore } from './readability-score';
import { CopyButton } from './copy-button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FeedbackDisplayProps {
  feedback: GenerateResumeFeedbackOutput | null;
  isLoading: boolean;
  error: string | null;
}

export default function FeedbackDisplay({ feedback, isLoading, error }: FeedbackDisplayProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error || !feedback) {
    return <InitialState />;
  }

  const textToCopy = `
## Resume Feedback
${feedback.feedback}

## Skill Suggestions
${feedback.skillSuggestions}
  `.trim();

  return (
    <Card className="h-fit">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-2xl font-headline">Analysis Results</CardTitle>
        <CopyButton textToCopy={textToCopy} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ReadabilityScore score={feedback.readabilityScore} />
        </div>
        
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary"/>
                AI Feedback
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap font-body pt-2">
              {feedback.feedback}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-3">
                <BrainCircuit className="h-5 w-5 text-primary"/>
                Skill Improvements
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap font-body pt-2">
              {feedback.skillSuggestions}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

const InitialState = () => (
  <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border bg-card p-12 text-center">
    <Bot className="mx-auto h-12 w-12 text-muted-foreground" />
    <h3 className="mt-4 text-lg font-medium text-foreground font-headline">Your feedback will appear here</h3>
    <p className="mt-1 text-sm text-muted-foreground">
      Upload your resume to get started.
    </p>
  </div>
);

const LoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="flex justify-center">
        <Skeleton className="h-36 w-36 rounded-full" />
      </div>
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </CardContent>
  </Card>
);
