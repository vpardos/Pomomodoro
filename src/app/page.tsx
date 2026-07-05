"use client";

import { useCallback } from "react";
import { usePomodoro, Phase } from "@/hooks/usePomodoro";
import { useNotifications } from "@/hooks/useNotifications";
import { playAlarm } from "@/lib/alarm";
import { TimerDisplay } from "@/components/timer-display";
import { SettingsDialog } from "@/components/settings-dialog";
import { TaskPlaceholder } from "@/components/task-placeholder";
import { ScheduleCard } from "@/components/alarm-card";
import { AlarmsCard } from "@/components/alarms-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteSelector } from "@/components/palette-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

export default function Home() {
  const {
    soundEnabled,
    notificationsEnabled,
    toggleSound,
    toggleNotifications,
    sendNotification,
    alarms,
    addAlarm,
    removeAlarm,
    toggleAlarm,
  } = useNotifications();

  const handlePhaseChange = useCallback(
    (from: Phase, to: Phase) => {
      if (soundEnabled) {
        playAlarm();
      }
      if (to === "work") {
        sendNotification("Break is over!", "Break is over!");
      } else {
        sendNotification(
          "Focus session complete!",
          "Focus session complete! Time for a break.",
        );
      }
    },
    [soundEnabled, sendNotification],
  );

  const {
    phase,
    timeLeft,
    isRunning,
    completedCycles,
    settings,
    progress,
    play,
    pause,
    reset,
    skip,
    updateSettings,
  } = usePomodoro(handlePhaseChange);

  const phaseLabels = {
    work: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  return (
    <div className="flex flex-col flex-1 bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-medium text-foreground flex items-center">
            Pomomodoro
            <a className="hidden sm:inline text-sm text-muted-foreground transition-colors font-mono">
              ‎ | a simple pomodoro timer
            </a>
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <PaletteSelector />
            <SettingsDialog
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-xl">
                  {phaseLabels[phase]}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    Cycle {completedCycles + 1}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-8">
                <TimerDisplay
                  progress={progress}
                  phase={phase}
                  timeLeft={timeLeft}
                />
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={reset}
                    disabled={!isRunning && timeLeft === 0}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  {isRunning ? (
                    <Button size="lg" onClick={pause} className="w-32">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={play}
                      disabled={timeLeft === 0}
                      className="w-32"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                  )}
                  <Button variant="outline" size="icon" onClick={skip}>
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <TaskPlaceholder />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ScheduleCard
              timeLeft={timeLeft}
              isRunning={isRunning}
              soundEnabled={soundEnabled}
              notificationsEnabled={notificationsEnabled}
              onToggleSound={toggleSound}
              onToggleNotifications={toggleNotifications}
            />
          </div>
          <div className="lg:col-span-1">
            <AlarmsCard
              alarms={alarms}
              onAddAlarm={addAlarm}
              onRemoveAlarm={removeAlarm}
              onToggleAlarm={toggleAlarm}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="container mx-auto px-4 py-4 text-center">
          <span className="text-sm text-muted-foreground transition-colors font-mono">
            2026 ©
            <a
              href="https://github.com/vpardoss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              ‎ vpardoss
            </a>
            , all rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
