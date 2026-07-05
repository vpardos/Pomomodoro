'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { flavors } from '@catppuccin/palette';
import type { ThemeMode } from './useTheme';

export type CatppuccinFlavor = 'latte' | 'frappe' | 'macchiato' | 'mocha';

const STORAGE_KEY = 'pomodoro-palette';

function getDefaultFlavor(mode: ThemeMode): CatppuccinFlavor {
  return mode === 'light' ? 'latte' : 'mocha';
}

function loadPalette(): CatppuccinFlavor | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'latte' || stored === 'frappe' || stored === 'macchiato' || stored === 'mocha') {
      return stored;
    }
  } catch (e) {
    console.error('Failed to load palette:', e);
  }
  return null;
}

function savePalette(flavor: CatppuccinFlavor) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, flavor);
  } catch (e) {
    console.error('Failed to save palette:', e);
  }
}

function applyPalette(flavor: CatppuccinFlavor, mode: ThemeMode) {
  const root = document.documentElement;
  const palette = flavors[flavor];
  const colors = palette.colors;

  // Base palette mapping
  root.style.setProperty('--background', `oklch(${colors.base.oklch.l} ${colors.base.oklch.c} ${colors.base.oklch.h})`);
  root.style.setProperty('--foreground', `oklch(${colors.text.oklch.l} ${colors.text.oklch.c} ${colors.text.oklch.h})`);
  
  root.style.setProperty('--card', `oklch(${colors.mantle.oklch.l} ${colors.mantle.oklch.c} ${colors.mantle.oklch.h})`);
  root.style.setProperty('--card-foreground', `oklch(${colors.text.oklch.l} ${colors.text.oklch.c} ${colors.text.oklch.h})`);
  
  root.style.setProperty('--popover', `oklch(${colors.mantle.oklch.l} ${colors.mantle.oklch.c} ${colors.mantle.oklch.h})`);
  root.style.setProperty('--popover-foreground', `oklch(${colors.text.oklch.l} ${colors.text.oklch.c} ${colors.text.oklch.h})`);
  
  root.style.setProperty('--primary', `oklch(${colors.mauve.oklch.l} ${colors.mauve.oklch.c} ${colors.mauve.oklch.h})`);
  root.style.setProperty('--primary-foreground', `oklch(${colors.crust.oklch.l} ${colors.crust.oklch.c} ${colors.crust.oklch.h})`);
  
  root.style.setProperty('--secondary', `oklch(${colors.surface0.oklch.l} ${colors.surface0.oklch.c} ${colors.surface0.oklch.h})`);
  root.style.setProperty('--secondary-foreground', `oklch(${colors.text.oklch.l} ${colors.text.oklch.c} ${colors.text.oklch.h})`);
  
  root.style.setProperty('--muted', `oklch(${colors.surface1.oklch.l} ${colors.surface1.oklch.c} ${colors.surface1.oklch.h})`);
  root.style.setProperty('--muted-foreground', `oklch(${colors.subtext0.oklch.l} ${colors.subtext0.oklch.c} ${colors.subtext0.oklch.h})`);
  
  root.style.setProperty('--accent', `oklch(${colors.surface2.oklch.l} ${colors.surface2.oklch.c} ${colors.surface2.oklch.h})`);
  root.style.setProperty('--accent-foreground', `oklch(${colors.text.oklch.l} ${colors.text.oklch.c} ${colors.text.oklch.h})`);
  
  root.style.setProperty('--destructive', `oklch(${colors.red.oklch.l} ${colors.red.oklch.c} ${colors.red.oklch.h})`);
  
  root.style.setProperty('--border', `oklch(${colors.surface1.oklch.l} ${colors.surface1.oklch.c} ${colors.surface1.oklch.h} / 0.5)`);
  root.style.setProperty('--input', `oklch(${colors.surface0.oklch.l} ${colors.surface0.oklch.c} ${colors.surface0.oklch.h})`);
  root.style.setProperty('--ring', `oklch(${colors.mauve.oklch.l} ${colors.mauve.oklch.c} ${colors.mauve.oklch.h})`);
  
  // Phase accent colors
  root.style.setProperty('--accent-work', `oklch(${colors.peach.oklch.l} ${colors.peach.oklch.c} ${colors.peach.oklch.h})`);
  root.style.setProperty('--accent-break', `oklch(${colors.green.oklch.l} ${colors.green.oklch.c} ${colors.green.oklch.h})`);
  root.style.setProperty('--accent-rest', `oklch(${colors.blue.oklch.l} ${colors.blue.oklch.c} ${colors.blue.oklch.h})`);

  // OLED pure-black overrides
    if (mode === 'oled') {
      root.style.setProperty('--background', 'oklch(0 0 0)');
      root.style.setProperty('--card', 'oklch(0.08 0 0)');
      root.style.setProperty('--popover', 'oklch(0.08 0 0)');
      root.style.setProperty('--secondary', 'oklch(0.14 0 0)');
      root.style.setProperty('--muted', 'oklch(0.4 0 0)');
      root.style.setProperty('--accent', 'oklch(0.14 0 0)');
      root.style.setProperty('--border', 'oklch(1 0 0 / 0.07)');
      root.style.setProperty('--input', 'oklch(1 0 0 / 0.1)');
    }
}

export function usePalette(mode: ThemeMode) {
  const [flavor, setFlavor] = useState<CatppuccinFlavor>(() => getDefaultFlavor(mode));

  useEffect(() => {
    const stored = loadPalette();
    if (stored !== null) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFlavor(stored);
    }
  }, []);

  // Compute effective flavor based on mode
  const effectiveFlavor = useMemo(() => {
    if (mode === 'light') {
      return 'latte';
    }
    if ((mode === 'dark' || mode === 'oled') && flavor === 'latte') {
      return 'macchiato';
    }
    return flavor;
  }, [mode, flavor]);

  useEffect(() => {
    applyPalette(effectiveFlavor, mode);
  }, [effectiveFlavor, mode]);

  const setPaletteFlavor = useCallback((newFlavor: CatppuccinFlavor) => {
    setFlavor(newFlavor);
    savePalette(newFlavor);
  }, []);

  return { flavor: effectiveFlavor, setPaletteFlavor };
}
