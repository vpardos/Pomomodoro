'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Phase } from '@/hooks/usePomodoro';

interface SessionDotsProps {
  completedCycles: number;
  longBreakInterval: number;
  phase: Phase;
}

/**
 * Renders a row of dots representing progress through the Pomodoro cycle.
 * - Filled (phase color) = completed work session
 * - Ring (phase color)   = current work session
 * - Empty (muted)        = upcoming work session
 */
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
              'inline-block size-2 rounded-full transition-colors duration-300',
              isEmpty && 'bg-muted',
            )}
            style={
              isCompleted
                ? { backgroundColor: phaseAccent }
                : isCurrent
                  ? { backgroundColor: 'transparent', boxShadow: `inset 0 0 0 2px ${phaseAccent}` }
                  : undefined
            }
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
});
