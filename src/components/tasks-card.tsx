"use client";

import { useState, useRef, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task, MAX_TASKS } from "@/hooks/useTasks";
import { ListTodo, Plus, Check, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

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
          <ListTodo className="h-5 w-5" />
          Tasks
        </CardTitle>
        {mounted && totalCount > 0 && (
          <CardAction>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {completedCount}/{totalCount} done
            </span>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyDown={handleAddKeyDown}
            placeholder={isMaxTasks ? "Max tasks reached" : "Add a task..."}
            disabled={isMaxTasks}
            className="text-sm"
          />
          <Button
            size="icon"
            onClick={handleAddTask}
            disabled={!newTaskText.trim() || isMaxTasks}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 min-h-0">
          {mounted && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50"
              >
                <Button
                  variant={task.completed ? "default" : "outline"}
                  size="icon-xs"
                  onClick={() => onToggleTask(task.id)}
                  className="shrink-0"
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </Button>
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
                    className={`flex-1 truncate text-sm cursor-pointer ${
                      task.completed
                        ? "line-through text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {task.text}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onMoveTask(task.id, "up")}
                  disabled={index === 0}
                  className="shrink-0 h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => onMoveTask(task.id, "down")}
                  disabled={index === tasks.length - 1}
                  className="shrink-0 h-6 w-6 text-muted-foreground hover:text-foreground"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveTask(task.id)}
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : mounted ? (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No tasks yet
            </div>
          ) : null}
        </div>

        {mounted && (hasUncompleted || completedCount > 0) && (
          <div className="flex gap-2">
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
