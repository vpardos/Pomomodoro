'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface SessionDotsProps {
  completedCycles: number;
  longBreakInterval: number;
  phase: Phase;
}

export const SessionDots = React.memo(function SessionDots({
  completedCycles,
  longBreakInterval,
  phase,
}: SessionDotsProps) {
  const phaseAccent = {
    work: 'var(--accent-work)',
    shortBreak: 'var(--accent-break)',
    longBreak: 'var(--accent-rest)',
  }[phase];

  const total = Math.max(1, longBreakInterval);
  const currentIndex = phase === 'work' ? completedCycles % total : -1;

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="presentation"
      aria-label={`Cycle progress: ${completedCycles} of ${total} sessions completed`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isCompleted = phase === 'work' && i < currentIndex;
        const isCurrent = phase === 'work' && i === currentIndex;
        const isEmpty = phase === 'work' && i > currentIndex;

        return (
          <span
            key={i}
            className={cn(
              'relative inline-flex items-center justify-center size-2 rounded-full transition-all',
              isEmpty && 'bg-muted',
              isCompleted && 'scale-125',
            )}
            style={
              isCompleted
                ? { 
                    backgroundColor: phaseAccent, 
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }
                : isCurrent
                  ? { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 2px ${phaseAccent}` }
                  : undefined
            }
            aria-hidden="true"
          >
            {isCurrent && (
              <span
                className="absolute -inset-1 rounded-full border-2 animate-pulse-ring"
                style={{ borderColor: phaseAccent }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
});
