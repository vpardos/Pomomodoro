"use client";

import { useState, useEffect, useCallback } from "react";

const TASKS_KEY = "pomodoro-tasks";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load tasks:", e);
  }
  return [];
}

function saveTasks(tasks: Task[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const moveTask = useCallback((id: string, direction: "up" | "down") => {
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, []);

  return {
    tasks,
    addTask,
    removeTask,
    toggleTask,
    moveTask,
    clearCompleted,
  };
}
