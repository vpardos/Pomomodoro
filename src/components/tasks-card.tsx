"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, MAX_TASKS } from "@/hooks/useTasks";
import { ListTodo, Plus, Check, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TasksCardProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onRemoveTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onMoveTask: (id: string, direction: "up" | "down") => void;
  onClearCompleted: () => void;
  onEditTask: (id: string, newText: string) => void;
  onMarkAllCompleted: () => void;
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

export function TasksCard({
  tasks,
  onAddTask,
  onRemoveTask,
  onToggleTask,
  onMoveTask,
  onClearCompleted,
  onEditTask,
  onMarkAllCompleted,
}: TasksCardProps) {
  const mounted = useMounted();
  const [newTaskText, setNewTaskText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);

  const isMaxTasks = tasks.length >= MAX_TASKS;

  const handleAddTask = () => {
    const trimmed = newTaskText.trim();
    if (!trimmed || isMaxTasks) return;
    onAddTask(trimmed);
    setNewTaskText("");
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editText.trim();
    if (trimmed) {
      onEditTask(editingId, trimmed);
    }
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const hasUncompleted = completedCount < totalCount;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          <span>Tasks</span>
        </CardTitle>
        {mounted && totalCount > 0 && (
          <CardAction>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder={isMaxTasks ? "Max tasks reached" : "Add a task…"}
            disabled={isMaxTasks}
            className="text-sm focus-visible:shadow-md focus-visible:shadow-primary/10 transition-shadow"
            aria-label="New task"
          />
          <Button
            size="icon"
            onClick={handleAddTask}
            disabled={!newTaskText.trim() || isMaxTasks}
            className="shrink-0"
            aria-label="Add task"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {mounted && tasks.length > 0 ? (
            <ul className="flex flex-col">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  className={cn(
                    "group flex items-center gap-2 py-2 -mx-1 px-1 rounded-md transition-all duration-300 hover:bg-muted/60 animate-fade-in-up",
                    index !== tasks.length - 1 && "border-b border-border/40",
                  )}
                  style={{ animationDelay: `${index * 50}ms`, animationDuration: '0.4s' }}
                >
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    aria-label={task.completed ? "Mark task incomplete" : "Mark task complete"}
                    aria-pressed={task.completed}
                    className={cn(
                      "shrink-0 grid place-items-center size-5 rounded-full border transition-all duration-300",
                      task.completed
                        ? "bg-foreground border-foreground text-background scale-110"
                        : "border-border hover:border-foreground/60",
                    )}
                  >
                    {task.completed && <Check className="size-3" />}
                  </button>
                  {editingId === task.id ? (
                    <Input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={saveEdit}
                      autoFocus
                      className="flex-1 text-sm h-7 py-1"
                    />
                  ) : (
                    <span
                      onClick={() => startEditing(task)}
                      className={cn(
                        "flex-1 truncate text-sm cursor-text transition-colors",
                        task.completed
                          ? "line-through text-muted-foreground"
                          : "text-foreground",
                      )}
                    >
                      {task.text}
                    </span>
                  )}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onMoveTask(task.id, "up")}
                      disabled={index === 0}
                      className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform duration-200"
                      aria-label="Move task up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onMoveTask(task.id, "down")}
                      disabled={index === tasks.length - 1}
                      className="text-muted-foreground hover:text-foreground hover:scale-110 transition-transform duration-200"
                      aria-label="Move task down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => onRemoveTask(task.id)}
                      className="text-muted-foreground hover:text-destructive hover:scale-110 transition-transform duration-200"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : mounted ? (
            <div className="flex-1 grid place-items-center py-8 text-center animate-fade-in-up">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ListTodo className="h-6 w-6 opacity-40 animate-float" />
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs">Add one above to get started</p>
              </div>
            </div>
          ) : null}
        </div>

        {mounted && totalCount > 0 && (hasUncompleted || completedCount > 0) && (
          <div className="flex gap-2 pt-1">
            {hasUncompleted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllCompleted}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                Mark all done
              </Button>
            )}
            {completedCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearCompleted}
                className="flex-1 text-muted-foreground hover:text-foreground"
              >
                Clear completed
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
