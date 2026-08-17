import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UtilityTimer {
  id: string;
  label: string;
  durationMs: number;
  remainingMs: number;
  isRunning: boolean;
  endTime: number | null;
}

interface Stopwatch {
  elapsedMs: number;
  isRunning: boolean;
  startTime: number | null;
}

interface UtilityTimerState {
  timers: UtilityTimer[];
  stopwatch: Stopwatch;
  
  // Stopwatch actions
  startStopwatch: () => void;
  pauseStopwatch: () => void;
  resetStopwatch: () => void;
  tickStopwatch: () => void;

  // Timer actions
  addTimer: (label: string, durationMs: number) => void;
  removeTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  tickTimers: () => void;
}

export const useUtilityTimerStore = create<UtilityTimerState>()(
  persist(
    (set) => ({
      timers: [
        { id: "1", label: "Tea Steeping", durationMs: 300000, remainingMs: 300000, isRunning: false, endTime: null },
        { id: "2", label: "Quick Break", durationMs: 600000, remainingMs: 600000, isRunning: false, endTime: null },
      ],
      stopwatch: { elapsedMs: 0, isRunning: false, startTime: null },

      startStopwatch: () => set((state) => {
        if (state.stopwatch.isRunning) return state;
        return {
          stopwatch: { 
            ...state.stopwatch, 
            isRunning: true, 
            startTime: Date.now() - state.stopwatch.elapsedMs 
          }
        };
      }),

      pauseStopwatch: () => set((state) => {
        if (!state.stopwatch.isRunning || !state.stopwatch.startTime) return state;
        const now = Date.now();
        return {
          stopwatch: {
            ...state.stopwatch,
            isRunning: false,
            elapsedMs: now - state.stopwatch.startTime,
            startTime: null
          }
        };
      }),

      resetStopwatch: () => set({
        stopwatch: { elapsedMs: 0, isRunning: false, startTime: null }
      }),

      tickStopwatch: () => set((state) => {
        if (!state.stopwatch.isRunning || !state.stopwatch.startTime) return state;
        const now = Date.now();
        return {
          stopwatch: {
            ...state.stopwatch,
            elapsedMs: now - state.stopwatch.startTime
          }
        };
      }),

      addTimer: (label, durationMs) => set((state) => ({
        timers: [...state.timers, {
          id: crypto.randomUUID(),
          label,
          durationMs,
          remainingMs: durationMs,
          isRunning: false,
          endTime: null
        }]
      })),

      removeTimer: (id) => set((state) => ({
        timers: state.timers.filter((t) => t.id !== id)
      })),

      startTimer: (id) => set((state) => ({
        timers: state.timers.map(t => {
          if (t.id !== id || t.isRunning) return t;
          return { ...t, isRunning: true, endTime: Date.now() + t.remainingMs };
        })
      })),

      pauseTimer: (id) => set((state) => ({
        timers: state.timers.map(t => {
          if (t.id !== id || !t.isRunning || !t.endTime) return t;
          const now = Date.now();
          const remaining = Math.max(0, t.endTime - now);
          return {
            ...t,
            isRunning: false,
            remainingMs: remaining,
            endTime: null
          };
        })
      })),

      resetTimer: (id) => set((state) => ({
        timers: state.timers.map(t => 
          t.id === id ? { ...t, isRunning: false, remainingMs: t.durationMs, endTime: null } : t
        )
      })),

      tickTimers: () => set((state) => {
        const now = Date.now();
        let hasChanges = false;
        
        const newTimers = state.timers.map(t => {
          if (!t.isRunning || !t.endTime) return t;
          
          const newRemaining = Math.max(0, t.endTime - now);
          if (newRemaining !== t.remainingMs) hasChanges = true;
          
          if (newRemaining === 0 && t.remainingMs > 0) {
            // Just finished
            hasChanges = true;
            return { ...t, remainingMs: 0, isRunning: false, endTime: null };
          }
          
          return { ...t, remainingMs: newRemaining };
        });

        return hasChanges ? { timers: newTimers } : state;
      }),
    }),
    {
      name: "utility-timers-storage-v2",
    }
  )
);
