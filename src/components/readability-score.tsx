'use client';
import { useEffect, useState } from 'react';

interface ReadabilityScoreProps {
  score: number;
}

export function ReadabilityScore({ score }: ReadabilityScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => setAnimatedScore(score));
    return () => cancelAnimationFrame(animationFrame);
  }, [score]);

  const circumference = 2 * Math.PI * 52; // 2 * pi * radius
  const offset = circumference - (animatedScore / 100) * circumference;

  const scoreColorVar = score < 40 ? 'var(--color-destructive)' : score < 70 ? 'var(--color-warning)' : 'var(--color-success)';
  
  return (
    <div className="relative h-36 w-36" style={{
      '--color-destructive': 'hsl(var(--destructive))',
      '--color-warning': 'hsl(var(--chart-4))',
      '--color-success': 'hsl(var(--chart-2))',
    } as React.CSSProperties}>
      <svg className="h-full w-full" viewBox="0 0 120 120">
        <circle
          className="stroke-muted"
          strokeWidth="8"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        <circle
          className="transform -rotate-90 origin-center transition-all duration-1000 ease-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
          style={{ stroke: scoreColorVar }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold font-headline" style={{ color: scoreColorVar }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-sm text-muted-foreground">Readability</span>
      </div>
    </div>
  );
}
