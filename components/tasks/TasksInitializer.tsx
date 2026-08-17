"use client";

import { useRef } from "react";
import { useTaskStore, Task, Subtask } from "@/store/useTaskStore";

export function TasksInitializer({
  tasks,
  subtasks,
}: {
  tasks: Task[];
  subtasks: Subtask[];
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useTaskStore.getState().setInitialData(tasks, subtasks);
    initialized.current = true;
  }

  return null;
}
