'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, Sparkles, UploadCloud, File as FileIcon, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const formSchema = z.object({
  file: z.instanceof(File).refine(file => file.size > 0, 'File is required.'),
});

interface ResumeFormProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export default function ResumeForm({ onAnalyze, isLoading }: ResumeFormProps) {
  const [file, setFile] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      form.setValue('file', uploadedFile, { shouldValidate: true });
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

  const onSubmit = () => {
    if(file) {
      onAnalyze(file);
    }
  };

  const removeFile = () => {
    setFile(null);
    form.reset();
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Upload Your Resume</CardTitle>
        <CardDescription>Upload a PDF or DOCX file to get instant AI-powered feedback.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <CardContent>
            <FormField
              control={form.control}
              name="file"
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
