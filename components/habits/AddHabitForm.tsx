"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createHabit } from "@/actions/habits";

export function AddHabitForm() {
  const [newHabit, setNewHabit] = useState("");
  const [newEmoji, setNewEmoji] = useState("💧");
  const [isPending, startTransition] = useTransition();

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    const title = newHabit;
    const emoji = newEmoji;
    setNewHabit("");
    setNewEmoji("💧");
    startTransition(async () => {
      await createHabit(title, emoji);
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold tracking-tight mb-4">Habits Tracker</h2>
      <form onSubmit={handleAddHabit} className="flex flex-col sm:flex-row items-center gap-3">
        <Input
          value={newEmoji}
          onChange={(e) => setNewEmoji(e.target.value)}
          className="w-16 h-12 text-center text-xl shadow-sm"
          maxLength={2}
          disabled={isPending}
          placeholder="🚀"
        />
        <Input
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="New habit (e.g., Drink Water)"
          className="h-12 text-base shadow-sm flex-1"
          disabled={isPending}
        />
        <Button type="submit" size="lg" disabled={!newHabit.trim() || isPending} className="w-full sm:w-auto">
          <Plus className="mr-2 h-5 w-5" /> Add Habit
        </Button>
      </form>
    </div>
  );
}
