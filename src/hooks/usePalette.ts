'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { flavors } from '@catppuccin/palette';
import type { ThemeMode } from './useTheme';

export type PaletteFlavor = 'latte' | 'frappe' | 'macchiato' | 'mocha' | 'dracula' | 'nord-polar' | 'nord-snow' | 'nord-frost' | 'nord-aurora' | 'solarized-light' | 'solarized-dark' | 'tokyo-night' | 'rose-pine';

// Keep backward compatibility
export type CatppuccinFlavor = PaletteFlavor;

const STORAGE_KEY = 'pomodoro-palette';

// Dracula color palette
const draculaColors = {
  background: '#282a36',
  card: '#44475a',
  foreground: '#f8f8f2',
  primary: '#bd93f9',
  secondary: '#44475a',
  muted: '#6272a4',
  accent: '#6272a4',
  destructive: '#ff5555',
  border: '#6272a4',
  work: '#ffb86c',
  break: '#50fa7b',
  rest: '#8be9fd',
};

// Nord dark color palette
const nordColors = {
  background: '#2e3440',
  card: '#3b4252',
  foreground: '#eceff4',
  primary: '#88c0d0',
  secondary: '#434c5e',
  muted: '#4c566a',
  accent: '#4c566a',
  destructive: '#bf616a',
  border: '#434c5e',
  work: '#d08770',
  break: '#a3be8c',
  rest: '#5e81ac',
};

// Nord light color palette
const nordLightColors = {
  background: '#eceff4',
  card: '#e5e9f0',
  foreground: '#2e3440',
  primary: '#5e81ac',
  secondary: '#d8dee9',
  muted: '#d8dee9',
  accent: '#d8dee9',
  destructive: '#bf616a',
  border: '#d8dee9',
  work: '#d08770',
  break: '#a3be8c',
  rest: '#5e81ac',
};

// Nord Polar Night - dark theme using Polar Night colors with white-ish primary for readability
const nordPolarColors = {
  background: '#2e3440',
  card: '#3b4252',
  foreground: '#eceff4',
  primary: '#eceff4',
  secondary: '#434c5e',
  muted: '#4c566a',
  accent: '#434c5e',
  destructive: '#bf616a',
  border: '#434c5e',
  work: '#d08770',
  break: '#a3be8c',
  rest: '#88c0d0',
};

// Nord Snow Storm - light theme using Snow Storm colors
const nordSnowColors = {
  background: '#eceff4',
  card: '#e5e9f0',
  foreground: '#2e3440',
  primary: '#5e81ac',
  secondary: '#d8dee9',
  muted: '#d8dee9',
  accent: '#d8dee9',
  destructive: '#bf616a',
  border: '#d8dee9',
  work: '#d08770',
  break: '#a3be8c',
  rest: '#5e81ac',
};

// Nord Frost - dark theme emphasizing Frost (bluish) colors
const nordFrostColors = {
  background: '#2e3440',
  card: '#3b4252',
  foreground: '#eceff4',
  primary: '#8fbcbb',
  secondary: '#434c5e',
  muted: '#4c566a',
  accent: '#434c5e',
  destructive: '#bf616a',
  border: '#434c5e',
  work: '#88c0d0',
  break: '#8fbcbb',
  rest: '#5e81ac',
};

// Nord Aurora - dark theme emphasizing Aurora (colorful) accents
const nordAuroraColors = {
  background: '#2e3440',
  card: '#3b4252',
  foreground: '#eceff4',
  primary: '#a3be8c',
  secondary: '#434c5e',
  muted: '#4c566a',
  accent: '#434c5e',
  destructive: '#bf616a',
  border: '#434c5e',
  work: '#d08770',
  break: '#a3be8c',
  rest: '#88c0d0',
};

const solarizedLightColors = {
  background: '#fdf6e3',
  card: '#eee8d5',
  foreground: '#073642',
  primary: '#268bd2',
  secondary: '#eee8d5',
  muted: '#93a1a1',
  accent: '#eee8d5',
  destructive: '#dc322f',
  border: '#93a1a1',
  work: '#cb4b16',
  break: '#859900',
  rest: '#268bd2',
};

const solarizedDarkColors = {
  background: '#002b36',
  card: '#073642',
  foreground: '#839496',
  primary: '#268bd2',
  secondary: '#073642',
  muted: '#586e75',
  accent: '#073642',
  destructive: '#dc322f',
  border: '#586e75',
  work: '#cb4b16',
  break: '#859900',
  rest: '#268bd2',
};

const tokyoNightColors = {
  background: '#1a1b26',
  card: '#24283b',
  foreground: '#a9b1d6',
  primary: '#7aa2f7',
  secondary: '#24283b',
  muted: '#414868',
  accent: '#24283b',
  destructive: '#f7768e',
  border: '#414868',
  work: '#ff9e64',
  break: '#73daca',
  rest: '#7aa2f7',
};

const rosePineColors = {
  background: '#191724',
  card: '#1f1d2e',
  foreground: '#e0def4',
  primary: '#c4a7e7',
  secondary: '#26233a',
  muted: '#6e6a86',
  accent: '#26233a',
  destructive: '#eb6f92',
  border: '#6e6a86',
  work: '#f6c177',
  break: '#9ccfd8',
  rest: '#c4a7e7',
};

function getDefaultFlavor(mode: ThemeMode): PaletteFlavor {
  return mode === 'light' ? 'latte' : 'mocha';
}

function loadPalette(): PaletteFlavor | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const validFlavors: PaletteFlavor[] = ['latte', 'frappe', 'macchiato', 'mocha', 'dracula', 'nord-polar', 'nord-snow', 'nord-frost', 'nord-aurora', 'solarized-light', 'solarized-dark', 'tokyo-night', 'rose-pine'];
    if (stored && validFlavors.includes(stored as PaletteFlavor)) {
      return stored as PaletteFlavor;
    }
  } catch (e) {
    console.error('Failed to load palette:', e);
  }
  return null;
}

function savePalette(flavor: PaletteFlavor) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, flavor);
  } catch (e) {
    console.error('Failed to save palette:', e);
  }
}

function applyCatppuccinPalette(flavor: 'latte' | 'frappe' | 'macchiato' | 'mocha', mode: ThemeMode) {
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
}

function applyCustomPalette(colors: typeof draculaColors, mode: ThemeMode) {
  const root = document.documentElement;

  root.style.setProperty('--background', colors.background);
  root.style.setProperty('--foreground', colors.foreground);
  
  root.style.setProperty('--card', colors.card);
  root.style.setProperty('--card-foreground', colors.foreground);
  
  root.style.setProperty('--popover', colors.card);
  root.style.setProperty('--popover-foreground', colors.foreground);
  
  root.style.setProperty('--primary', colors.primary);
  root.style.setProperty('--primary-foreground', colors.background);
  
  root.style.setProperty('--secondary', colors.secondary);
  root.style.setProperty('--secondary-foreground', colors.foreground);
  
  root.style.setProperty('--muted', colors.muted);
  root.style.setProperty('--muted-foreground', colors.foreground);
  
  root.style.setProperty('--accent', colors.accent);
  root.style.setProperty('--accent-foreground', colors.foreground);
  
  root.style.setProperty('--destructive', colors.destructive);
  
  root.style.setProperty('--border', `${colors.border}80`); // 50% opacity
  root.style.setProperty('--input', colors.secondary);
  root.style.setProperty('--ring', colors.primary);
  
  // Phase accent colors
  root.style.setProperty('--accent-work', colors.work);
  root.style.setProperty('--accent-break', colors.break);
  root.style.setProperty('--accent-rest', colors.rest);
}

function applyPalette(flavor: PaletteFlavor, mode: ThemeMode) {
  if (flavor === 'dracula') {
    applyCustomPalette(draculaColors, mode);
  } else if (flavor === 'nord-polar') {
    applyCustomPalette(nordPolarColors, mode);
  } else if (flavor === 'nord-snow') {
    applyCustomPalette(nordSnowColors, mode);
  } else if (flavor === 'nord-frost') {
    applyCustomPalette(nordFrostColors, mode);
  } else if (flavor === 'nord-aurora') {
    applyCustomPalette(nordAuroraColors, mode);
  } else if (flavor === 'solarized-light') {
    applyCustomPalette(solarizedLightColors, mode);
  } else if (flavor === 'solarized-dark') {
    applyCustomPalette(solarizedDarkColors, mode);
  } else if (flavor === 'tokyo-night') {
    applyCustomPalette(tokyoNightColors, mode);
  } else if (flavor === 'rose-pine') {
    applyCustomPalette(rosePineColors, mode);
  } else {
    applyCatppuccinPalette(flavor, mode);
  }

  // OLED pure-black overrides
  if (mode === 'oled') {
    const root = document.documentElement;
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
  const [flavor, setFlavor] = useState<PaletteFlavor>(() => getDefaultFlavor(mode));

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
      // In light mode, only light-compatible flavors are allowed
      if (flavor === 'latte' || flavor === 'nord-snow' || flavor === 'solarized-light') {
        return flavor;
      }
      // Default to latte if a dark flavor was selected
      return 'latte';
    }
    // In dark/oled mode, light-only flavors are not available
    if ((mode === 'dark' || mode === 'oled') && (flavor === 'latte' || flavor === 'nord-snow' || flavor === 'solarized-light')) {
      return 'mocha';
    }
    return flavor;
  }, [mode, flavor]);

  useEffect(() => {
    applyPalette(effectiveFlavor, mode);
  }, [effectiveFlavor, mode]);

  const setPaletteFlavor = useCallback((newFlavor: PaletteFlavor) => {
    setFlavor(newFlavor);
    savePalette(newFlavor);
  }, []);

  return { flavor: effectiveFlavor, setPaletteFlavor };
}
