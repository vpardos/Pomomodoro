'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CircularProgress } from '@/components/circular-progress';
import { LinearProgress } from '@/components/linear-progress';
import { Phase } from '@/hooks/usePomodoro';

interface TimerDisplayProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
}

export function TimerDisplay({ progress, phase, timeLeft }: TimerDisplayProps) {
  const [progressStyle, setProgressStyle] = useState<'circular' | 'linear'>('circular');

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex items-center justify-center size-[min(240px,80vw)]">
        {progressStyle === 'circular' ? (
          <CircularProgress progress={progress} phase={phase} timeLeft={timeLeft} />
        ) : (
          <LinearProgress progress={progress} phase={phase} timeLeft={timeLeft} />
        )}
      </div>
      <Tabs value={progressStyle} onValueChange={(v) => setProgressStyle(v as 'circular' | 'linear')}>
        <TabsList>
          <TabsTrigger value="circular">Circular</TabsTrigger>
          <TabsTrigger value="linear">Linear</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
