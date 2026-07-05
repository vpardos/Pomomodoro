"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alarm } from "@/hooks/useNotifications";
import { Bell, Plus, Trash2 } from "lucide-react";

interface AlarmsCardProps {
  alarms: Alarm[];
  onAddAlarm: (time: string, label?: string) => void;
  onRemoveAlarm: (id: string) => void;
  onToggleAlarm: (id: string) => void;
}

function formatTime24to12(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
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

export function AlarmsCard({
  alarms,
  onAddAlarm,
  onRemoveAlarm,
  onToggleAlarm,
}: AlarmsCardProps) {
  const mounted = useMounted();
  const [hour, setHour] = useState(12);
  const [minute, setMinute] = useState(0);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [label, setLabel] = useState("");

  const handleAddAlarm = () => {
    const hours24 = period === "PM" ? (hour % 12) + 12 : hour % 12;
    const time = `${hours24.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    onAddAlarm(time, label || undefined);
    setLabel("");
  };

  const incrementHour = () => setHour((h) => (h % 12) + 1);
  const decrementHour = () => setHour((h) => (h === 1 ? 12 : h - 1));
  const incrementMinute = () => setMinute((m) => (m + 1) % 60);
  const decrementMinute = () => setMinute((m) => (m === 0 ? 59 : m - 1));
  const togglePeriod = () => setPeriod((p) => (p === "AM" ? "PM" : "AM"));

  const isMaxAlarms = alarms.length >= 2;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alarms
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Set Alarm
          </span>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={incrementHour}
                className="h-6 w-10"
              >
                <span className="text-xs">▲</span>
              </Button>
              <div className="h-12 w-14 flex items-center justify-center rounded-lg bg-muted text-2xl font-mono font-semibold text-foreground tabular-nums">
                {mounted ? hour.toString().padStart(2, "0") : "--"}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={decrementHour}
                className="h-6 w-10"
              >
                <span className="text-xs">▼</span>
              </Button>
            </div>
            <span className="text-2xl font-mono font-semibold text-muted-foreground">
              :
            </span>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={incrementMinute}
                className="h-6 w-10"
              >
                <span className="text-xs">▲</span>
              </Button>
              <div className="h-12 w-14 flex items-center justify-center rounded-lg bg-muted text-2xl font-mono font-semibold text-foreground tabular-nums">
                {mounted ? minute.toString().padStart(2, "0") : "--"}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={decrementMinute}
                className="h-6 w-10"
              >
                <span className="text-xs">▼</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={togglePeriod}
                className="h-6 w-12"
              >
                <span className="text-xs">▲</span>
              </Button>
              <div className="h-12 w-14 flex items-center justify-center rounded-lg bg-muted text-lg font-semibold text-foreground">
                {mounted ? period : "--"}
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={togglePeriod}
                className="h-6 w-12"
              >
                <span className="text-xs">▼</span>
              </Button>
            </div>
            <Button
              size="icon"
              onClick={handleAddAlarm}
              disabled={isMaxAlarms}
              className="ml-2 shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Name (optional)"
            className="text-sm"
          />
        </div>

        <div className="border-t border-border pt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              My Alarms
            </span>
            <span className="text-xs text-muted-foreground">
              {alarms.length} {alarms.length === 1 ? "alarm" : "alarms"}
            </span>
          </div>

          {alarms.length > 0 ? (
            <div className="flex flex-col gap-2">
              {alarms.map((alarm) => (
                <div
                  key={alarm.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-mono font-semibold text-foreground tabular-nums">
                        {formatTime24to12(alarm.time)}
                      </span>
                      {alarm.label && (
                        <span className="text-xs text-muted-foreground">
                          {alarm.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => onToggleAlarm(alarm.id)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveAlarm(alarm.id)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No alarms set
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
