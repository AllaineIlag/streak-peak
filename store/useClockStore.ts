import { create } from "zustand";
import { Database } from "@/lib/database.types";

export type Timezone = Database["public"]["Tables"]["timezones"]["Row"];

interface ClockState {
  timezones: Timezone[];
  isHydrated: boolean;

  setInitialData: (timezones: Timezone[]) => void;
  
  // Optimistic UI Actions
  addTimezone: (timezone: Timezone) => void;
  removeTimezone: (id: string) => void;
}

export const useClockStore = create<ClockState>((set) => ({
  timezones: [],
  isHydrated: false,

  setInitialData: (timezones) => set({ timezones, isHydrated: true }),

  addTimezone: (timezone) => set((state) => ({ 
    timezones: [...state.timezones, timezone]
  })),

  removeTimezone: (id) => set((state) => ({
    timezones: state.timezones.filter((t) => t.id !== id)
  })),
}));
