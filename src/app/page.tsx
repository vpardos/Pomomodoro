"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePomodoro, Phase } from "@/hooks/usePomodoro";
import { useNotifications } from "@/hooks/useNotifications";
import { useTasks } from "@/hooks/useTasks";
import { playAlarm } from "@/lib/alarm";
import { TimerDisplay, ProgressStyle } from "@/components/timer-display";
import { SessionDots } from "@/components/session-dots";
import { SettingsDialog } from "@/components/settings-dialog";
import { TasksCard } from "@/components/tasks-card";
import { ScheduleCard } from "@/components/alarm-card";
import { AlarmsCard } from "@/components/alarms-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteSelector } from "@/components/palette-selector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle, Square, Play, Pause, RotateCcw, SkipForward, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

const phaseLabels: Record<Phase, string> = {
  work: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const phaseAccentVar = {
  work: "var(--accent-work)",
  shortBreak: "var(--accent-break)",
  longBreak: "var(--accent-rest)",
};

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
  const {
    tasks,
    addTask,
    removeTask,
    toggleTask,
    moveTask,
    clearCompleted,
    editTask,
    markAllCompleted,
  } = useTasks();

  const handlePhaseChange = useCallback(
    (from: Phase, to: Phase) => {
      if (soundEnabled) playAlarm();
      if (to === "work") sendNotification("Break is over!", "Break is over!");
      else sendNotification("Focus session complete!", "Focus session complete! Time for a break.");
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

  const [progressStyle, setProgressStyle] = useState<ProgressStyle>("circular");

  const phaseAccent = phaseAccentVar[phase];

  return (
    <div className="flex flex-col flex-1 bg-background relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-[0.04] animate-blob-drift"
          style={{ backgroundColor: phaseAccent }}
        />
        <div
          className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.05] animate-blob-drift-alt"
          style={{ backgroundColor: phaseAccent }}
        />
        <div
          className="absolute top-[50%] left-[50%] w-[300px] h-[300px] rounded-full blur-[80px] opacity-[0.03] animate-blob-drift-slow"
          style={{ backgroundColor: phaseAccent }}
        />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/70 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
            aria-label="Pomomodoro home"
          >
            <span
              aria-hidden="true"
              className="grid place-items-center size-9 rounded-lg bg-foreground text-background transition-transform duration-200 hover:scale-105"
            >
              <Timer className="size-4" />
            </span>
            <span className="text-lg sm:text-xl font-semibold tracking-tight">
              Pomomodoro
            </span>
          </Link>
          <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="App settings">
            <ThemeToggle />
            <PaletteSelector />
            <SettingsDialog settings={settings} onUpdateSettings={updateSettings} />
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* TIMER CARD */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "0ms" }}>
            <Card className="h-full">
              <CardHeader className="relative">
                <CardTitle className="flex flex-col items-center gap-1.5 text-center">
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {phaseLabels[phase]}
                  </span>
                  <span className="text-xs font-normal text-muted-foreground tabular-nums">
                    Session {Math.min(completedCycles + 1, settings.longBreakInterval)} of {settings.longBreakInterval}
                  </span>
                </CardTitle>
                {/* Progress style switch */}
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center rounded-md border border-border/60 bg-background/60 p-0.5"
                  role="group"
                  aria-label="Progress style"
                >
                  <button
                    type="button"
                    onClick={() => setProgressStyle("circular")}
                    aria-pressed={progressStyle === "circular"}
                    aria-label="Circular progress"
                    className={cn(
                      "grid place-items-center size-7 rounded-sm transition-all duration-200 hover:scale-110",
                      progressStyle === "circular"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Circle
                      className="size-3.5"
                      fill={progressStyle === "circular" ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setProgressStyle("linear")}
                    aria-pressed={progressStyle === "linear"}
                    aria-label="Linear progress"
                    className={cn(
                      "grid place-items-center size-7 rounded-sm transition-all duration-200 hover:scale-110",
                      progressStyle === "linear"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Square
                      className="size-3"
                      fill={progressStyle === "linear" ? "currentColor" : "none"}
                    />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-6 sm:gap-8 pt-2">
                <TimerDisplay
                  progress={progress}
                  phase={phase}
                  timeLeft={timeLeft}
                  style={progressStyle}
                  isRunning={isRunning}
                />
                <SessionDots
                  completedCycles={completedCycles}
                  longBreakInterval={settings.longBreakInterval}
                  phase={phase}
                />
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={reset}
                    aria-label="Reset timer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                  {isRunning ? (
                    <Button
                      size="lg"
                      onClick={pause}
                      className="w-40 sm:w-44 font-semibold"
                      aria-label="Pause timer"
                    >
                      <Pause className="h-4 w-4 mr-2" fill="currentColor" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      onClick={play}
                      disabled={timeLeft === 0}
                      className="w-40 sm:w-44 font-semibold"
                      aria-label="Start timer"
                    >
                      <Play className="h-4 w-4 mr-2" fill="currentColor" />
                      Play
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skip}
                    aria-label="Skip to next phase"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* TASKS CARD */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <TasksCard
              tasks={tasks}
              onAddTask={addTask}
              onRemoveTask={removeTask}
              onToggleTask={toggleTask}
              onMoveTask={moveTask}
              onClearCompleted={clearCompleted}
              onEditTask={editTask}
              onMarkAllCompleted={markAllCompleted}
            />
          </div>

          {/* SCHEDULE CARD */}
          <div className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <ScheduleCard
              timeLeft={timeLeft}
              isRunning={isRunning}
              soundEnabled={soundEnabled}
              notificationsEnabled={notificationsEnabled}
              onToggleSound={toggleSound}
              onToggleNotifications={toggleNotifications}
            />
          </div>

          {/* ALARMS CARD */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <AlarmsCard
              alarms={alarms}
              onAddAlarm={addAlarm}
              onRemoveAlarm={removeAlarm}
              onToggleAlarm={toggleAlarm}
            />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/60 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs text-muted-foreground">
          <span>Pomomodoro</span>
          <span aria-hidden="true">·</span>
          <span>created by</span>
          <a
            href="https://github.com/vpardos/Pomomodoro"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-foreground/80 hover:text-foreground transition-colors hover:underline underline-offset-4"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            vpardos
          </a>
        </div>
      </footer>
    </div>
  );
}
