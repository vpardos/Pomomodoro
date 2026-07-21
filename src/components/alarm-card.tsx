"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

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
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>Schedule & Alerts</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        {/* Time row: Now / Ends */}
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              Now
            </span>
            <span className="text-3xl font-mono font-semibold text-foreground tabular-nums leading-none">
              {mounted ? formatTime(now) : "--:--"}
            </span>
          </div>
          <div className="flex flex-col gap-1 items-end text-right">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {isRunning ? "Ends" : "Status"}
            </span>
            {isRunning ? (
              <span className="text-3xl font-mono font-semibold text-foreground tabular-nums leading-none">
                {mounted ? formatTime(finishTime) : "--:--"}
              </span>
            ) : (
              <span className="text-3xl font-medium text-muted-foreground leading-none">
                Paused
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-border/60" />

        {/* Toggle rows */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor="sound-toggle"
                className="text-sm font-medium cursor-pointer"
              >
                Sound Alarm
              </Label>
              <span className="text-xs text-muted-foreground">
                Play a chime when a cycle ends
              </span>
            </div>
            <Switch
              id="sound-toggle"
              checked={soundEnabled}
              onCheckedChange={onToggleSound}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor="notification-toggle"
                className="text-sm font-medium cursor-pointer"
              >
                Notifications
              </Label>
              <span className="text-xs text-muted-foreground">
                Show desktop notifications on cycle end
              </span>
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
