'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  resume: z.string().min(100, {
    message: 'Resume must be at least 100 characters to provide a meaningful analysis.',
  }),
});

interface ResumeFormProps {
  onAnalyze: (data: z.infer<typeof formSchema>) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onAnalyze, isLoading }: ResumeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
    },
  });

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Resume</CardTitle>
        <CardDescription>Paste your resume text below to get instant AI-powered feedback.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAnalyze)}>
          <CardContent>
            <FormField
              control={form.control}
              name="resume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Resume Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your full resume text here..."
                      className="min-h-[400px] text-sm resize-y focus-visible:ring-accent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
              {isLoading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              Analyze Resume
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
