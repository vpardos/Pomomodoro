'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('SessionDots');

  const phaseAccent = {
    work: 'var(--accent-work)',
    shortBreak: 'var(--accent-break)',
    longBreak: 'var(--accent-rest)',
  }[phase];

  const total = Math.max(1, longBreakInterval);
  const currentIndex = phase === 'work' ? completedCycles % total : -1;

  // Track which dot just completed so we can trigger the pop animation.
  const prevCompletedRef = useRef(completedCycles);
  const [justCompletedIdx, setJustCompletedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (completedCycles > prevCompletedRef.current) {
      setJustCompletedIdx((completedCycles - 1) % total);
      const timer = setTimeout(() => setJustCompletedIdx(null), 350);
      prevCompletedRef.current = completedCycles;
      return () => clearTimeout(timer);
    }
    prevCompletedRef.current = completedCycles;
  }, [completedCycles, total]);

  return (
    <div
      className="flex items-center justify-center gap-2"
      role="presentation"
      aria-label={t('cycleProgress', { completed: completedCycles, total })}
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
              i === justCompletedIdx && 'animate-pop',
            )}
            style={
              isCompleted
                ? {
                    backgroundColor: phaseAccent,
                    transitionDuration: '500ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }
                : isCurrent
                  ? {
                      opacity: 1,
                      backgroundColor: 'transparent',
                      boxShadow: `inset 0 0 0 2px ${phaseAccent}`,
                    }
                  : { opacity: 0.4 }
            }
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
});
