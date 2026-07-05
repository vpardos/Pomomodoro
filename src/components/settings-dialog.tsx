'use client';

import { useState } from 'react';
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
import { PomodoroSettings } from '@/hooks/usePomodoro';

interface SettingsDialogProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
}

export function SettingsDialog({ settings, onUpdateSettings }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(Math.floor(settings.workDuration / 60));
  const [shortBreakMinutes, setShortBreakMinutes] = useState(Math.floor(settings.shortBreakDuration / 60));
  const [longBreakMinutes, setLongBreakMinutes] = useState(Math.floor(settings.longBreakDuration / 60));
  const [longBreakInterval, setLongBreakInterval] = useState(settings.longBreakInterval);

  const handleSave = () => {
    const newSettings: PomodoroSettings = {
      workDuration: Math.max(1, Math.min(180, workMinutes)) * 60,
      shortBreakDuration: Math.max(1, Math.min(60, shortBreakMinutes)) * 60,
      longBreakDuration: Math.max(1, Math.min(60, longBreakMinutes)) * 60,
      longBreakInterval: Math.max(1, Math.min(10, longBreakInterval)),
    };
    onUpdateSettings(newSettings);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        <Settings className="size-4" />
        <span className="hidden min-[1024px]:inline">Pomodoro Settings</span>
      </DialogTrigger>
      <DialogContent className="min-[1024px]:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Timer Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="work">Focus Duration (minutes)</Label>
            <Input
              id="work"
              type="number"
              min={1}
              max={180}
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shortBreak">Short Break (minutes)</Label>
            <Input
              id="shortBreak"
              type="number"
              min={1}
              max={60}
              value={shortBreakMinutes}
              onChange={(e) => setShortBreakMinutes(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="longBreak">Long Break (minutes)</Label>
            <Input
              id="longBreak"
              type="number"
              min={1}
              max={60}
              value={longBreakMinutes}
              onChange={(e) => setLongBreakMinutes(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="interval">Long Break Interval (cycles)</Label>
            <Input
              id="interval"
              type="number"
              min={1}
              max={10}
              value={longBreakInterval}
              onChange={(e) => setLongBreakInterval(parseInt(e.target.value) || 1)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
