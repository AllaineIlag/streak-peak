import { create } from "zustand";
import { MoodLog } from "@/actions/mood";

interface MoodState {
  logs: MoodLog[];
  isHydrated: boolean;
  setInitialData: (logs: MoodLog[]) => void;
  
  addOrUpdateLog: (log: MoodLog) => void;
  removeLog: (id: string) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  logs: [],
  isHydrated: false,
  
  setInitialData: (logs) => set({ logs, isHydrated: true }),
  
  addOrUpdateLog: (log) => set((state) => {
    const existingIndex = state.logs.findIndex(l => l.date === log.date || l.id === log.id);
    if (existingIndex >= 0) {
      const newLogs = [...state.logs];
      newLogs[existingIndex] = { ...newLogs[existingIndex], ...log };
      return { logs: newLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) };
    } else {
      return { 
        logs: [...state.logs, log].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
      };
    }
  }),
  
  removeLog: (id) => set((state) => ({
    logs: state.logs.filter((l) => l.id !== id)
  }))
}));
