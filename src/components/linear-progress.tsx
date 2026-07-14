'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface LinearProgressProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
}

export const LinearProgress = React.memo(function LinearProgress({ progress, phase, timeLeft }: LinearProgressProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const phaseColor = {
    work: 'var(--accent-work)',
    shortBreak: 'var(--accent-break)',
    longBreak: 'var(--accent-rest)',
  }[phase];

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="text-center">
        <span className="text-6xl min-[1024px]:text-7xl font-bold text-foreground font-mono tabular-nums tracking-tight">
          {timeStr}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-[width] duration-1000 ease-linear rounded-full')}
          style={{ width: `${progress * 100}%`, backgroundColor: phaseColor }}
        />
      </div>
    </div>
  );
});
