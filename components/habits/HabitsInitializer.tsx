"use client";

import { useEffect, useRef } from "react";
import { useHabitStore, Habit, HabitCheckin } from "@/store/useHabitStore";

export function HabitsInitializer({
  habits,
  checkins,
}: {
  habits: Habit[];
  checkins: HabitCheckin[];
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useHabitStore.getState().setInitialData(habits, checkins);
      initialized.current = true;
    }
  }, [habits, checkins]);

  return null;
}
