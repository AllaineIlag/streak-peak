"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createTask } from "@/actions/tasks";
import { useTaskStore } from "@/store/useTaskStore";

export function AddTaskForm() {
  const [newTask, setNewTask] = useState("");
  const [isPending, startTransition] = useTransition();
  const { addTask } = useTaskStore();

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const title = newTask;
    setNewTask("");
    startTransition(async () => {
      try {
        const createdTask = await createTask(title);
        if (createdTask) addTask(createdTask);
      } catch (err) {
        console.error("Failed to create task:", err);
      }
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Tasks</h2>
      <form onSubmit={handleAddTask} className="flex items-center gap-3">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          className="h-12 text-base shadow-sm"
          disabled={isPending}
        />
        <Button type="submit" size="lg" disabled={!newTask.trim() || isPending}>
          <Plus className="mr-2 h-5 w-5" /> Add Task
        </Button>
      </form>
    </div>
  );
}
