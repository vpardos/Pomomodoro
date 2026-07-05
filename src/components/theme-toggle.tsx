'use client';

import { useThemeContext } from '@/components/theme-provider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Circle, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeMode } from '@/hooks/useTheme';

const themeInfo: Record<ThemeMode, { name: string; icon: typeof Sun; description: string }> = {
  light: { name: 'Light', icon: Sun, description: 'Standard light theme' },
  dark: { name: 'Dark', icon: Moon, description: 'Easy on the eyes' },
  oled: { name: 'OLED', icon: Circle, description: 'Pure black for OLED displays' },
};

export function ThemeToggle() {
  const { mode, setThemeMode } = useThemeContext();

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Monitor className="size-4" />
        <span className="hidden min-[1024px]:inline">Theme</span>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Theme Mode</h3>
          <div className="flex flex-col gap-1">
            {(Object.keys(themeInfo) as ThemeMode[]).map((m) => {
              const info = themeInfo[m];
              const Icon = info.icon;
              const isSelected = mode === m;
              
              return (
                <button
                  key={m}
                  onClick={() => setThemeMode(m)}
                  className={cn(
                    'flex items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted',
                    isSelected && 'bg-muted ring-2 ring-primary'
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4 text-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {info.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {info.description}
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
