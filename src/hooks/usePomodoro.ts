'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export type Phase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  longBreakInterval: 4,
};

const STORAGE_KEY = 'pomodoro-settings';

function loadSettings(): PomodoroSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: PomodoroSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

function getDurationForPhase(phase: Phase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'work':
      return settings.workDuration;
    case 'shortBreak':
      return settings.shortBreakDuration;
    case 'longBreak':
      return settings.longBreakDuration;
  }
}

function getNextPhase(
  currentPhase: Phase,
  completedCycles: number,
  longBreakInterval: number
): { phase: Phase; cycles: number } {
  if (currentPhase === 'work') {
    const newCycles = completedCycles + 1;
    if (newCycles % longBreakInterval === 0) {
      return { phase: 'longBreak', cycles: newCycles };
    } else {
      return { phase: 'shortBreak', cycles: newCycles };
    }
  } else {
    return { phase: 'work', cycles: completedCycles };
  }
}

export function usePomodoro(onPhaseChange?: (from: Phase, to: Phase) => void) {
  const [settings, setSettings] = useState<PomodoroSettings>(DEFAULT_SETTINGS);
  const [phase, setPhase] = useState<Phase>('work');
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.workDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(0);
  const stateRef = useRef({ phase, completedCycles, settings, timeLeft });
  const onPhaseChangeRef = useRef(onPhaseChange);

  useEffect(() => {
    stateRef.current = { phase, completedCycles, settings, timeLeft };
  }, [phase, completedCycles, settings, timeLeft]);

  useEffect(() => {
    onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  useEffect(() => {
    const loaded = loadSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(loaded);
    setTimeLeft(loaded.workDuration);
  }, []);

  const updateSettings = useCallback((newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    if (!stateRef.current.timeLeft || !isRunning) {
      setTimeLeft(getDurationForPhase(stateRef.current.phase, newSettings));
    }
  }, [isRunning]);

  const totalTime = getDurationForPhase(phase, settings);

  useEffect(() => {
    if (isRunning) {
      lastTickRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = Math.floor((now - lastTickRef.current) / 1000);
        lastTickRef.current = now;

        const s = stateRef.current;
        const newTime = Math.max(0, s.timeLeft - delta);
        setTimeLeft(newTime);

        if (newTime === 0) {
          setIsRunning(false);
          const { phase: nextPhase, cycles: newCycles } = getNextPhase(
            s.phase,
            s.completedCycles,
            s.settings.longBreakInterval
          );
          onPhaseChangeRef.current?.(s.phase, nextPhase);
          setPhase(nextPhase);
          setCompletedCycles(newCycles);
          setTimeLeft(getDurationForPhase(nextPhase, s.settings));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const phaseStr = phase === 'work' ? 'Focus' : phase === 'shortBreak' ? 'Short Break' : 'Long Break';
    document.title = `(${timeStr}) ${phaseStr} | Pomodoro`;
  }, [timeLeft, phase]);

  const play = useCallback(() => {
    if (stateRef.current.timeLeft > 0) {
      setIsRunning(true);
    }
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    const s = stateRef.current;
    setTimeLeft(getDurationForPhase(s.phase, s.settings));
  }, []);

  const skip = useCallback(() => {
    setIsRunning(false);
    const s = stateRef.current;
    const { phase: nextPhase, cycles: newCycles } = getNextPhase(
      s.phase,
      s.completedCycles,
      s.settings.longBreakInterval
    );
    onPhaseChangeRef.current?.(s.phase, nextPhase);
    setPhase(nextPhase);
    setCompletedCycles(newCycles);
    setTimeLeft(getDurationForPhase(nextPhase, s.settings));
  }, []);

  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;

  return {
    phase,
    timeLeft,
    totalTime,
    isRunning,
    completedCycles,
    settings,
    progress,
    play,
    pause,
    reset,
    skip,
    updateSettings,
  };
}
