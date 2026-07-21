'use client';

import React from 'react';
import { CircularProgress } from '@/components/circular-progress';
import { LinearProgress } from '@/components/linear-progress';
import { Phase } from '@/hooks/usePomodoro';

export type ProgressStyle = 'circular' | 'linear';

interface TimerDisplayProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
  style: ProgressStyle;
  isRunning?: boolean;
}

export const TimerDisplay = React.memo(function TimerDisplay({ progress, phase, timeLeft, style, isRunning }: TimerDisplayProps) {
  return (
    <div className="flex items-center justify-center size-[min(280px,80vw)] transition-colors duration-700">
      {style === 'circular' ? (
        <CircularProgress progress={progress} phase={phase} timeLeft={timeLeft} isRunning={isRunning} />
      ) : (
        <LinearProgress progress={progress} phase={phase} timeLeft={timeLeft} isRunning={isRunning} />
      )}
    </div>
  );
});
