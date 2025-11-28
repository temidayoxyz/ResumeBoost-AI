import { FileText } from 'lucide-react';
import { ModeToggle } from './mode-toggle';

export default function AppHeader() {
  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-foreground">
            ResumeBoost AI
          </h1>
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
