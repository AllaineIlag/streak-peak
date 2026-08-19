"use client";

import { useEffect, useRef } from "react";
import { useTaskStore, Task, Subtask } from "@/store/useTaskStore";

export function TasksInitializer({
  tasks,
  subtasks,
}: {
  tasks: Task[];
  subtasks: Subtask[];
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useTaskStore.getState().setInitialData(tasks, subtasks);
      initialized.current = true;
    }
  }, [tasks, subtasks]);

  return null;
}
