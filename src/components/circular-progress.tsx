'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface CircularProgressProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
  isRunning?: boolean;
}

export const CircularProgress = React.memo(function CircularProgress({ progress, phase, timeLeft, isRunning }: CircularProgressProps) {
  const radius = 120;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const phaseAccent = {
    work: 'var(--accent-work)',
    shortBreak: 'var(--accent-break)',
    longBreak: 'var(--accent-rest)',
  }[phase];

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className={cn("relative flex items-center justify-center", isRunning && "animate-breathe")}>
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        <circle
          className="text-muted"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className={cn('transition-[stroke-dashoffset] duration-700 ease-linear')}
          stroke={phaseAccent}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, filter: `drop-shadow(0 0 6px ${phaseAccent})` }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span 
          className="text-6xl min-[1024px]:text-7xl font-bold text-foreground font-mono tabular-nums tracking-tight transition-colors duration-700"
          style={{ textShadow: `0 0 24px ${phaseAccent}40` }}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
});
