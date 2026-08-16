'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { PomodoroSettings } from '@/hooks/usePomodoro';

interface SettingsDialogProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
}

export function SettingsDialog({ settings, onUpdateSettings }: SettingsDialogProps) {
  const t = useTranslations('Settings');
  const [open, setOpen] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(Math.floor(settings.workDuration / 60));
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(settings.shortBreakDuration / 60));
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(settings.longBreakDuration / 60));
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);
  const [animationsEnabled, setAnimationsEnabled] = useState(settings.animationsEnabled);

  const handleSave = () => {
    const newSettings: PomodoroSettings = {
      workDuration: Math.max(1, Math.min(180, workMinutes)) * 60,
      shortBreakDuration: Math.max(1, Math.min(60, shortBreakMinutes)) * 60,
      longBreakDuration: Math.max(1, Math.min(60, longBreakMinutes)) * 60,
      longBreakInterval: Math.max(1, Math.min(10, longBreakInterval)),
      animationsEnabled,
    };
    onUpdateSettings(newSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label={t('trigger.aria')}
          />
        }
      >
        <Settings className="size-4" />
        <span className="hidden min-[1024px]:inline">{t('trigger.label')}</span>
      </DialogTrigger>
      <DialogContent className="min-[1024px]:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
            <div className="grid gap-0.5">
              <Label htmlFor="animations" className="cursor-pointer">
                {t('animations.label')}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t('animations.description')}
              </p>
            </div>
            <Switch
              id="animations"
              size="sm"
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
              aria-label={t('animations.aria')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="work">{t('focusDuration')}</Label>
            <Input
              id="work"
              type="number"
              min={1}
              max={180}
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 1)}
              className="focus-visible:shadow-md focus-visible:shadow-primary/10 transition-shadow"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortBreak">{t('shortBreak')}</Label>
            <Input
              id="shortBreak"
              type="number"
              min={1}
              max={60}
              value={shortBreakMinutes}
              onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 1)}
              className="focus-visible:shadow-md focus-visible:shadow-primary/10 transition-shadow"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="longBreak">{t('longBreak')}</Label>
            <Input
              id="longBreak"
              type="number"
              min={1}
              max={60}
              value={longBreakMinutes}
              onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 1)}
              className="focus-visible:shadow-md focus-visible:shadow-primary/10 transition-shadow"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interval">{t('longBreakInterval')}</Label>
            <Input
              id="interval"
              type="number"
              min={1}
              max={10}
              value={longBreakInterval}
              onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 1)}
              className="focus-visible:shadow-md focus-visible:shadow-primary/10 transition-shadow"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSave}>{t('save')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
