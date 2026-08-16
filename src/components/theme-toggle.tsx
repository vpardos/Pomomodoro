'use client';

import { useThemeContext } from '@/components/theme-provider';
import { useTranslations } from 'next-intl';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Circle, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ThemeMode } from '@/hooks/useTheme';

const themeInfo: Record<ThemeMode, { icon: typeof Sun }> = {
  light: { icon: Sun },
  dark: { icon: Moon },
  oled: { icon: Circle },
};

export function ThemeToggle() {
  const t = useTranslations('Theme');
  const { mode, setThemeMode } = useThemeContext();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label={t('trigger.aria')}
          />
        }
      >
        <Monitor className="size-4" />
        <span className="hidden min-[1024px]:inline">{t('trigger.label')}</span>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">{t('heading')}</h3>
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
                    isSelected && 'bg-muted ring-2 ring-primary shadow-md shadow-primary/20'
                  )}
                  aria-pressed={isSelected}
                >
                  <Icon className="size-4 text-foreground" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {t(`modes.${m}.name`)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {t(`modes.${m}.description`)}
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
