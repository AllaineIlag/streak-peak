"use client";

import { useTimerStore } from "@/store/useTimerStore";
import { TimerCard } from "./TimerCard";
import { AddTimerCard } from "./AddTimerCard";

export function PomodoroGrid() {
  const { presets } = useTimerStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {presets.map((preset) => (
        <TimerCard key={preset.id} preset={preset} />
      ))}
      <AddTimerCard />
    </div>
  );
}
