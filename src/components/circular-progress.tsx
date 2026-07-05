'use client';

import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface CircularProgressProps {
  progress: number;
  phase: Phase;
  timeLeft: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CircularProgress({ progress, phase: _phase, timeLeft }: CircularProgressProps) {
  const radius = 120;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="relative flex items-center justify-center">
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
          className={cn('transition-all duration-1000 ease-linear')}
          stroke="var(--foreground)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-5xl sm:text-6xl font-bold text-foreground font-mono tabular-nums">
          {timeStr}
        </span>
      </div>
    </div>
  );
}
