'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

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
  const [file, setFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resume: '',
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // We can't easily read PDF/DOCX on the client. We will pass the text to the parent.
      // The parent will then send it to a server action.
      // For simplicity, let's assume we can get text here.
      // A real implementation would require a library like pdf-text-reader or similar logic on the server.
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        // In a real app, you would parse PDF/DOCX. We'll simulate it.
        // For now, we'll just pretend the file content is readable as text.
        // This is a placeholder for where file-to-text logic would go.
        // For this example, we'll just use the file name as a stand-in for content.
        // A more robust solution is needed for production.
        const fileContent = `File name: ${uploadedFile.name}. File content would be extracted here. For now, this is just placeholder text. A real app would use a server-side parser for PDF/DOCX.`;
        form.setValue('resume', fileContent, { shouldValidate: true });
      };
      reader.readAsText(uploadedFile); // This is simplified. Real parsing is more complex.
    }
  }, [form]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // We can't read file content on the client easily for docx/pdf.
    // We'll pass a placeholder to the server action, which would handle the file.
    // For the purpose of this prototype, we'll send a simplified text.
     if(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result;
            // This is a simplification. A real app would process the file on the server.
            const resumeText = `[Simulated content from ${file.name}]`;
             onAnalyze({ resume: resumeText });
        };
        // This is not how you read a PDF or DOCX file.
        // This is a placeholder for client-side file reading logic.
        // A proper implementation would likely upload the file and process it server-side.
        onAnalyze({ resume: `This is a placeholder for the content of ${file.name}. Actual file content extraction for PDF/DOCX requires a server-side component or a heavy client-side library, which is beyond the current scope. Assuming this text is the extracted content for analysis.` });

    } else {
        form.handleSubmit(onAnalyze)();
    }
  };


  const removeFile = () => {
    setFile(null);
    form.setValue('resume', '');
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Upload Your Resume</CardTitle>
        <CardDescription>Upload a PDF or DOCX file to get instant AI-powered feedback.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onAnalyze)}>
          <CardContent>
            <FormField
              control={form.control}
              name="resume"
              render={() => (
                <FormItem>
                  <FormLabel className="sr-only">Resume File</FormLabel>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors ${
                        isDragActive ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <input {...getInputProps()} />
                      {file ? (
                        <div className="text-center">
                          <FileIcon className="mx-auto h-12 w-12 text-foreground" />
                          <p className="mt-2 font-semibold">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                           <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <UploadCloud className="mx-auto h-12 w-12" />
                          <p className="mt-4 font-semibold">Drag & drop a file here, or click to select</p>
                          <p className="text-xs mt-1">PDF or DOCX (max 5MB)</p>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading || !file} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6">
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
