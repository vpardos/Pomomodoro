'use client';

import { useThemeContext } from '@/components/theme-provider';
import { flavors } from '@catppuccin/palette';
import { PaletteFlavor } from '@/hooks/usePalette';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const flavorInfo: Record<PaletteFlavor, { name: string; emoji: string; dark: boolean; swatches: string[] }> = {
  latte: { name: 'Latte', emoji: '☕', dark: false, swatches: ['#eff1f5', '#8839ef', '#40a02b', '#fe640b'] },
  frappe: { name: 'Frappé', emoji: '🌊', dark: true, swatches: ['#303446', '#ca9ee6', '#a6d189', '#ef9f76'] },
  macchiato: { name: 'Macchiato', emoji: '🌺', dark: true, swatches: ['#24273a', '#c6a0f6', '#a6da95', '#f5a97f'] },
  mocha: { name: 'Mocha', emoji: '🌿', dark: true, swatches: ['#1e1e2e', '#cba6f7', '#a6e3a1', '#fab387'] },
  dracula: { name: 'Dracula', emoji: '🧛', dark: true, swatches: ['#282a36', '#bd93f9', '#50fa7b', '#ffb86c'] },
  'nord-polar': { name: 'Nord Polar Night', emoji: '🌑', dark: true, swatches: ['#2e3440', '#3b4252', '#434c5e', '#4c566a'] },
  'nord-snow': { name: 'Nord Snow Storm', emoji: '☁️', dark: false, swatches: ['#eceff4', '#e5e9f0', '#d8dee9', '#5e81ac'] },
  'nord-frost': { name: 'Nord Frost', emoji: '🧊', dark: true, swatches: ['#2e3440', '#8fbcbb', '#88c0d0', '#5e81ac'] },
  'nord-aurora': { name: 'Nord Aurora', emoji: '🌌', dark: true, swatches: ['#2e3440', '#a3be8c', '#bf616a', '#d08770'] },
  'solarized-light': { name: 'Solarized Light', emoji: '☀️', dark: false, swatches: ['#fdf6e3', '#268bd2', '#859900', '#cb4b16'] },
  'solarized-dark': { name: 'Solarized Dark', emoji: '🌙', dark: true, swatches: ['#002b36', '#268bd2', '#859900', '#cb4b16'] },
  'tokyo-night': { name: 'Tokyo Night', emoji: '🗼', dark: true, swatches: ['#1a1b26', '#7aa2f7', '#73daca', '#ff9e64'] },
  'rose-pine': { name: 'Rosé Pine', emoji: '🌸', dark: true, swatches: ['#191724', '#c4a7e7', '#9ccfd8', '#f6c177'] },
};

export function PaletteSelector() {
  const { flavor, setPaletteFlavor, mode } = useThemeContext();

  const isFlavorAvailable = (f: PaletteFlavor) => {
    if (mode === 'light') {
      return f === 'latte' || f === 'nord-snow' || f === 'solarized-light';
    }
    // dark or oled
    return f !== 'latte' && f !== 'nord-snow' && f !== 'solarized-light';
  };

  const getUnavailableMessage = (f: PaletteFlavor) => {
    if (mode === 'light' && f !== 'latte' && f !== 'nord-snow' && f !== 'solarized-light') return 'Not available in light mode';
    if ((mode === 'dark' || mode === 'oled') && (f === 'latte' || f === 'nord-snow' || f === 'solarized-light')) return 'Not available in dark mode';
    return '';
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label="Change color palette"
          />
        }
      >
        <Palette className="size-4" />
        <span className="hidden min-[1024px]:inline">Color Palette</span>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto py-3 px-3">
          <h3 className="text-sm font-semibold text-foreground sticky top-0 bg-popover z-10 pb-1">Color Palette</h3>
          <div className="flex flex-col gap-1">
            {([...Object.keys(flavorInfo) as PaletteFlavor[]]).sort((a, b) => {
              const aAvailable = isFlavorAvailable(a);
              const bAvailable = isFlavorAvailable(b);
              if (aAvailable && !bAvailable) return -1;
              if (!aAvailable && bAvailable) return 1;
              return 0;
            }).map((f) => {
              const info = flavorInfo[f];
              const isSelected = flavor === f;
              const isAvailable = isFlavorAvailable(f);
              const unavailableMessage = getUnavailableMessage(f);
              
              return (
                <button
                  key={f}
                  onClick={() => isAvailable && setPaletteFlavor(f)}
                  disabled={!isAvailable}
                  className={cn(
                    'flex items-center gap-3 rounded-md p-2 text-left transition-colors',
                    isAvailable && 'hover:bg-muted',
                    isSelected && isAvailable && 'bg-muted ring-2 ring-primary',
                    !isAvailable && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-pressed={isSelected}
                  aria-disabled={!isAvailable}
                  title={unavailableMessage}
                >
                  {/* Color swatches */}
                  <div className="flex gap-0.5">
                    {info.swatches.map((color, i) => (
                      <div
                        key={i}
                        className="size-4 rounded-sm transition-transform duration-200 hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  {/* Label */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {info.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {unavailableMessage || (info.dark ? 'Dark theme' : 'Light theme')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
