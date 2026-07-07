"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Task } from "@/hooks/useTasks";
import { ListTodo, Plus, Check, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

interface TasksCardProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onRemoveTask: (id: string) => void;
  onToggleTask: (id: string) => void;
  onMoveTask: (id: string, direction: "up" | "down") => void;
  onClearCompleted: () => void;
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
}: TasksCardProps) {
  const mounted = useMounted();
  const [newTaskText, setNewTaskText] = useState("");

  const handleAddTask = () => {
    const trimmed = newTaskText.trim();
    if (!trimmed) return;
    onAddTask(trimmed);
    setNewTaskText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

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
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="text-sm"
          />
          <Button
            size="icon"
            onClick={handleAddTask}
            disabled={!newTaskText.trim()}
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
                <span
                  className={`flex-1 truncate text-sm ${
                    task.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {task.text}
                </span>
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

        {mounted && completedCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCompleted}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Clear completed
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
