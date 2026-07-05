'use client';

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'oled';

const STORAGE_KEY = 'pomodoro-theme';

function getSystemPreference(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'oled') {
      return stored;
    }
  } catch (e) {
    console.error('Failed to load theme:', e);
  }
  return getSystemPreference();
}

function saveTheme(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (e) {
    console.error('Failed to save theme:', e);
  }
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.classList.remove('dark', 'oled');

  if (mode === 'dark') {
    root.classList.add('dark');
  } else if (mode === 'oled') {
    root.classList.add('dark', 'oled');
  }
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const initial = loadTheme();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(initial);
    applyTheme(initial);
  }, []);

  const setThemeMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    saveTheme(newMode);
    applyTheme(newMode);
  }, []);

  const cycleTheme = useCallback(() => {
    const next: Record<ThemeMode, ThemeMode> = {
      light: 'dark',
      dark: 'oled',
      oled: 'light',
    };
    setThemeMode(next[mode]);
  }, [mode, setThemeMode]);

  return { mode, setThemeMode, cycleTheme };
}
