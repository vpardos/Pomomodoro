'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface LinearProgressProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
  isRunning?: boolean;
}

export const LinearProgress = React.memo(function LinearProgress({ progress, phase, timeLeft, isRunning }: LinearProgressProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const phaseColor = {
    work: 'var(--accent-work)',
    shortBreak: 'var(--accent-break)',
    longBreak: 'var(--accent-rest)',
  }[phase];

  return (
    <div className={cn("w-full max-w-md flex flex-col gap-6", isRunning && "animate-breathe")}>
      <div className="text-center">
        <span 
          className="text-6xl min-[1024px]:text-7xl font-bold text-foreground font-mono tabular-nums tracking-tight transition-colors duration-700"
          style={{ textShadow: `0 0 24px ${phaseColor}40` }}
        >
          {timeStr}
        </span>
      </div>
      <div className="w-full h-2.5 bg-muted/40 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-foreground/5">
        <div
          className={cn('h-full transition-[width] duration-700 ease-linear rounded-full')}
          style={{ 
            width: `${progress * 100}%`, 
            backgroundColor: phaseColor,
            boxShadow: `0 0 10px ${phaseColor}`,
          }}
        />
      </div>
    </div>
  );
});
