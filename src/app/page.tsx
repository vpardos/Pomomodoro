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
          <h1 className="text-xl min-[1024px]:text-2xl font-medium text-foreground flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
              <path d="M3 5.5L5 3.5M21 5.5L19 3.5M9 12.5L11 14.5L15 10.5M20 12.5C20 16.9183 16.4183 20.5 12 20.5C7.58172 20.5 4 16.9183 4 12.5C4 8.08172 7.58172 4.5 12 4.5C16.4183 4.5 20 8.08172 20 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Pomomodoro
            <a className="hidden min-[1024px]:inline text-sm text-muted-foreground transition-colors font-mono">
              ‎ | a simple pomodoro timer
            </a>
          </h1>
          <div className="flex items-center gap-2 min-[1024px]:gap-3">
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
            Made by{" "}
            <a
              href="https://github.com/vpardos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
            >
              <svg width="16" height="16" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-text-bottom">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.3333 19V17.137C14.3583 16.8275 14.3154 16.5163 14.2073 16.2242C14.0993 15.9321 13.9286 15.6657 13.7067 15.4428C15.8 15.2156 18 14.4431 18 10.8989C17.9998 9.99256 17.6418 9.12101 17 8.46461C17.3039 7.67171 17.2824 6.79528 16.94 6.01739C16.94 6.01739 16.1533 5.7902 14.3333 6.97811C12.8053 6.57488 11.1947 6.57488 9.66666 6.97811C7.84666 5.7902 7.05999 6.01739 7.05999 6.01739C6.71757 6.79528 6.69609 7.67171 6.99999 8.46461C6.35341 9.12588 5.99501 10.0053 5.99999 10.9183C5.99999 14.4366 8.19999 15.2091 10.2933 15.4622C10.074 15.6829 9.90483 15.9461 9.79686 16.2347C9.68889 16.5232 9.64453 16.8306 9.66666 17.137V19" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9.66667 17.7018C7.66667 18.3335 6 17.7018 5 15.7544" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {" "}vpardos
            </a>
            .
          </span>
        </div>
      </footer>
    </div>
  );
}
