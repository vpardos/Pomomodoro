"use client";

import { useState, useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function AlarmsCard({
  alarms,
  onAddAlarm,
  onRemoveAlarm,
  onToggleAlarm,
}: AlarmsCardProps) {
  const timeId = useId();
  const labelId = useId();
  const [time, setTime] = useState("12:00");
  const [label, setLabel] = useState("");

  const handleAddAlarm = () => {
    if (!time) return;
    onAddAlarm(time, label.trim() || undefined);
    setLabel("");
  };

  const isMaxAlarms = alarms.length >= 2;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span>Alarms</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-5">
        {/* Add alarm form */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[auto_1fr_auto] items-end gap-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={timeId} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Time
              </Label>
              <Input
                id={timeId}
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-[120px] font-mono tabular-nums border-border focus-visible:border-primary focus-visible:shadow-md focus-visible:shadow-primary/10 transition-all"
                aria-label="Alarm time"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={labelId} className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Name
              </Label>
              <Input
                id={labelId}
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Optional"
                className="text-sm border-border focus-visible:border-primary focus-visible:shadow-md focus-visible:shadow-primary/10 transition-all"
                aria-label="Alarm label"
              />
            </div>
            <Button
              size="icon"
              onClick={handleAddAlarm}
              disabled={isMaxAlarms || !time}
              className="shrink-0 self-end"
              aria-label="Add alarm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="border-t border-border/60" />

        {/* My alarms list */}
        <div className="flex flex-col gap-3 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">My Alarms</h3>
            <span className="text-xs text-muted-foreground tabular-nums">
              {alarms.length} of 2
            </span>
          </div>

          {alarms.length > 0 ? (
            <ul className="flex flex-col">
              {alarms.map((alarm, index) => (
                <li
                  key={alarm.id}
                  className={`flex items-center justify-between gap-2 py-2.5 animate-slide-in-right ${
                    index !== alarms.length - 1 ? "border-b border-border/40" : ""
                  }`}
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex flex-col min-w-0">
                    <span
                      className={`text-lg font-mono font-semibold tabular-nums ${
                        alarm.enabled ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {formatTime24to12(alarm.time)}
                    </span>
                    {alarm.label && (
                      <span className="text-xs text-muted-foreground truncate">
                        {alarm.label}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={() => onToggleAlarm(alarm.id)}
                      aria-label={alarm.enabled ? "Disable alarm" : "Enable alarm"}
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemoveAlarm(alarm.id)}
                      className="text-muted-foreground hover:text-destructive hover:rotate-12 hover:scale-110 transition-transform duration-200"
                      aria-label="Delete alarm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex-1 grid place-items-center py-4 text-center animate-fade-in-up">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Bell className="h-6 w-6 opacity-40 animate-float" />
                <p className="text-sm">No alarms set</p>
                <p className="text-xs">Add one above to get notified</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
