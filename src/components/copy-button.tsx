'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, ClipboardCopy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    });
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={copyToClipboard} aria-label="Copy feedback">
            {hasCopied ? <Check className="h-4 w-4" /> : <ClipboardCopy className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{hasCopied ? 'Copied!' : 'Copy Feedback'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
