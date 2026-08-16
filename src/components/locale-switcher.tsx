'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routing } from '@/i18n/routing';

export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label={t('aria')}
          />
        }
      >
        <Languages className="size-4" />
        <span className="hidden min-[1024px]:inline">{t('label')}</span>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">{t('heading')}</h3>
          <div className="flex flex-col gap-1">
            {routing.locales.map((l) => {
              const isSelected = locale === l;
              return (
                <button
                  key={l}
                  onClick={() => router.replace(pathname, { locale: l })}
                  className={cn(
                    'flex items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted',
                    isSelected && 'bg-muted ring-2 ring-primary shadow-md shadow-primary/20',
                  )}
                  aria-pressed={isSelected}
                >
                  <span className="text-sm font-medium text-foreground">
                    {t(l)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
