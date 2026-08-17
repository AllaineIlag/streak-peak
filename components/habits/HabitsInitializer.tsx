"use client";

import { useRef } from "react";
import { useHabitStore, Habit, HabitCheckin } from "@/store/useHabitStore";

export function HabitsInitializer({
  habits,
  checkins,
}: {
  habits: Habit[];
  checkins: HabitCheckin[];
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useHabitStore.getState().setInitialData(habits, checkins);
    initialized.current = true;
  }

  return null;
}
