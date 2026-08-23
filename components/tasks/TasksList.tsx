"use client";

import { useEffect, useState } from "react";
import { TaskItem } from "./TaskItem";
import { Database } from "@/lib/database.types";
import { getTasksData } from "@/actions/tasks";
import { useTaskStore } from "@/store/useTaskStore";
import { TasksSkeleton } from "./TasksSkeleton";
import { cn } from "@/lib/utils";

export function TasksList() {
  const { tasks, subtasks, isHydrated, setInitialData } = useTaskStore();

  const [loading, setLoading] = useState(!isHydrated);
  const [wasInitiallyHydrated] = useState(isHydrated);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!isHydrated) setLoading(true);
      
      const { tasks: fetchedTasks, subtasks: fetchedSubtasks } = await getTasksData();
      
      if (isMounted) {
        if (fetchedTasks && fetchedSubtasks) {
          setInitialData(fetchedTasks, fetchedSubtasks);
        }
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [isHydrated, setInitialData]);

  if (!isHydrated && loading) return <TasksSkeleton />;

  const activeTasks = tasks.filter((t) => t.status === "active");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const animationClass = wasInitiallyHydrated ? "" : "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both";

  return (
    <div className={animationClass}>
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
