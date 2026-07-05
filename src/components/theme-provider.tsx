'use client';

import { createContext, useContext } from 'react';
import { useTheme, ThemeMode } from '@/hooks/useTheme';
import { usePalette, CatppuccinFlavor } from '@/hooks/usePalette';

interface ThemeContextValue {
  mode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  cycleTheme: () => void;
  flavor: CatppuccinFlavor;
  setPaletteFlavor: (flavor: CatppuccinFlavor) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useTheme();
  const palette = usePalette(theme.mode);

  const contextValue: ThemeContextValue = {
    ...theme,
    ...palette,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return ctx;
}
