'use client';

import { useThemeContext } from '@/components/theme-provider';
import { flavors } from '@catppuccin/palette';
import { CatppuccinFlavor } from '@/hooks/usePalette';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const flavorInfo: Record<CatppuccinFlavor, { name: string; emoji: string; dark: boolean }> = {
  latte: { name: 'Latte', emoji: '☕', dark: false },
  frappe: { name: 'Frappé', emoji: '🌊', dark: true },
  macchiato: { name: 'Macchiato', emoji: '🌺', dark: true },
  mocha: { name: 'Mocha', emoji: '🌿', dark: true },
};

export function PaletteSelector() {
  const { flavor, setPaletteFlavor, mode } = useThemeContext();

  const isFlavorAvailable = (f: CatppuccinFlavor) => {
    if (mode === 'light') return f === 'latte';
    return f !== 'latte';
  };

  const getUnavailableMessage = (f: CatppuccinFlavor) => {
    if (mode === 'light' && f !== 'latte') return 'Not available in light mode';
    if ((mode === 'dark' || mode === 'oled') && f === 'latte') return 'Not available in dark mode';
    return '';
  };

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Palette className="size-4" />
        <span className="hidden sm:inline">Color Palette</span>
      </PopoverTrigger>
      <PopoverContent className="w-64" align="end">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Color Palette</h3>
          <div className="flex flex-col gap-1">
            {(Object.keys(flavorInfo) as CatppuccinFlavor[]).map((f) => {
              const info = flavorInfo[f];
              const palette = flavors[f];
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
                    <div
                      className="size-4 rounded-sm"
                      style={{ backgroundColor: palette.colors.base.hex }}
                    />
                    <div
                      className="size-4 rounded-sm"
                      style={{ backgroundColor: palette.colors.mauve.hex }}
                    />
                    <div
                      className="size-4 rounded-sm"
                      style={{ backgroundColor: palette.colors.green.hex }}
                    />
                    <div
                      className="size-4 rounded-sm"
                      style={{ backgroundColor: palette.colors.peach.hex }}
                    />
                  </div>
                  
                  {/* Label */}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {info.emoji} {info.name}
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
