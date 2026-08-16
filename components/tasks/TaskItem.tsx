"use client";

import { useTransition, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { updateTaskStatus, toggleSubtask, createSubtask } from "@/actions/tasks";
import { Database } from "@/lib/database.types";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type Subtask = Database["public"]["Tables"]["subtasks"]["Row"];

export function TaskItem({
  task,
  subtasks,
}: {
  task: Task;
  subtasks: Subtask[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const isCompleted = task.status === "completed";

  const handleToggleTask = () => {
    startTransition(async () => {
      await updateTaskStatus(task.id, isCompleted ? "active" : "completed");
    });
  };

  const handleToggleSubtask = (subtaskId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleSubtask(subtaskId, !currentStatus);
    });
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    const title = newSubtask;
    setNewSubtask("");
    startTransition(async () => {
      await createSubtask(task.id, title);
    });
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleTask}
          disabled={isPending}
          className="h-5 w-5 rounded-full"
        />
        <Link 
          href={`/tasks/${task.id}`}
          className={cn(
            "flex-1 text-sm font-medium transition-colors hover:underline cursor-pointer",
            isCompleted && "text-muted-foreground line-through"
          )}
        >
          {task.title}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8 text-muted-foreground"
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>

      {isExpanded && (
        <div className="ml-8 mt-2 flex flex-col gap-3 border-l-2 pl-4">
          {subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <Checkbox
                checked={subtask.is_completed}
                onCheckedChange={() => handleToggleSubtask(subtask.id, subtask.is_completed)}
                disabled={isPending}
                className="h-4 w-4"
              />
              <span
                className={cn(
                  "text-sm",
                  subtask.is_completed && "text-muted-foreground line-through"
                )}
              >
                {subtask.title}
              </span>
            </div>
          ))}

          <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-1">
            <Input
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add subtask..."
              className="h-8 text-sm bg-transparent border-transparent hover:border-input focus-visible:ring-1"
              disabled={isPending}
            />
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8" disabled={!newSubtask.trim() || isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
