"use client";

import { TaskItem } from "./TaskItem";
import { Database } from "@/lib/database.types";

import { useTaskStore } from "@/store/useTaskStore";

export function TasksList() {
  const { tasks, subtasks, isHydrated } = useTaskStore();

  if (!isHydrated) return null; // Avoid hydration mismatch

  const activeTasks = tasks.filter((t) => t.status === "active");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
      <div className="space-y-4">
        {activeTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No active tasks. You're all caught up!</p>
        ) : (
          activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              subtasks={subtasks.filter((s) => s.task_id === task.id)}
            />
          ))
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="pt-8 border-t mt-8">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
            Completed
          </h3>
          <div className="space-y-4 opacity-75">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                subtasks={subtasks.filter((s) => s.task_id === task.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
