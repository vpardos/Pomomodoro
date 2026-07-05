"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock, Bell, Volume2, BellOff } from "lucide-react";

interface ScheduleCardProps {
  timeLeft: number;
  isRunning: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  onToggleSound: () => void;
  onToggleNotifications: () => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatFinishTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const useMounted = () => {
  return useSyncExternalStore(
    (callback) => {
      callback();
      return () => {};
    },
    () => true,
    () => false,
  );
};

export function ScheduleCard({
  timeLeft,
  isRunning,
  soundEnabled,
  notificationsEnabled,
  onToggleSound,
  onToggleNotifications,
}: ScheduleCardProps) {
  const mounted = useMounted();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const finishTime = new Date(now.getTime() + timeLeft * 1000);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Schedule & Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Current Time
            </span>
            <span className="text-2xl font-mono font-semibold text-foreground tabular-nums">
              {mounted ? formatTime(now) : "--:--"}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Cycle Ends
            </span>
            {isRunning ? (
              <span className="text-2xl font-mono font-semibold text-foreground tabular-nums">
                {mounted ? formatFinishTime(finishTime) : "--:--"}
              </span>
            ) : (
              <span className="text-2xl font-mono text-muted-foreground">
                Paused
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <Label
                  htmlFor="sound-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  Sound Alarm
                </Label>
                <span className="text-xs text-muted-foreground">
                  Play a sound when cycle ends
                </span>
              </div>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={onToggleSound}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-full bg-muted flex items-center justify-center">
                {!mounted || notificationsEnabled ? (
                  <Bell className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col">
                <Label
                  htmlFor="notification-toggle"
                  className="text-sm font-medium cursor-pointer"
                >
                  Notifications
                </Label>
                <span className="text-xs text-muted-foreground">
                  Enable notifications on cycle end
                </span>
              </div>
            </div>
            <Switch
              id="notification-toggle"
              checked={notificationsEnabled}
              onCheckedChange={onToggleNotifications}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
