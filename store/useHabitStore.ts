import { create } from "zustand";
import { Database } from "@/lib/database.types";

export type Habit = Database["public"]["Tables"]["habits"]["Row"];
export type HabitCheckin = Database["public"]["Tables"]["habit_checkins"]["Row"];

interface HabitState {
  habits: Habit[];
  checkins: HabitCheckin[];
  isHydrated: boolean;

  setInitialData: (habits: Habit[], checkins: HabitCheckin[]) => void;
  
  // Optimistic UI Actions
  addHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  
  toggleCheckin: (habitId: string, date: string, currentStatus: boolean) => void;
}

export const useHabitStore = create<HabitState>((set) => ({
  habits: [],
  checkins: [],
  isHydrated: false,

  setInitialData: (habits, checkins) => set({ habits, checkins, isHydrated: true }),

  addHabit: (habit) => set((state) => ({ 
    habits: [...state.habits, habit] // keep alphabetical or let it append
  })),

  deleteHabit: (habitId) => set((state) => ({
    habits: state.habits.filter((h) => h.id !== habitId),
    checkins: state.checkins.filter((c) => c.habit_id !== habitId)
  })),

  toggleCheckin: (habitId, date, currentStatus) => set((state) => {
    if (currentStatus) {
      // Removing the check-in
      return {
        checkins: state.checkins.filter((c) => !(c.habit_id === habitId && c.date === date))
      };
    } else {
      // Adding a check-in
      return {
        checkins: [...state.checkins, {
          id: crypto.randomUUID(), // optimistic ID
          habit_id: habitId,
          date: date,
          status: "completed",
          created_at: new Date().toISOString()
        }]
      };
    }
  }),
}));
