'use client';

import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface LinearProgressProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
}

export function LinearProgress({ progress, phase, timeLeft }: LinearProgressProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const phaseColors = {
    work: 'bg-foreground',
    shortBreak: 'bg-foreground',
    longBreak: 'bg-foreground',
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6">
      <div className="text-center">
        <span className="text-5xl sm:text-7xl font-bold text-foreground font-mono tabular-nums">
          {timeStr}
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-1000 ease-linear rounded-full', phaseColors[phase])}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
