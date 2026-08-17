import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerPhase = "focus" | "break";
export type TimerStatus = "idle" | "running" | "paused";

export interface TimerPreset {
  id: string;
  name: string;
  rounds: number; // e.g. 4
  baseFocus: number; // in minutes
  focusChange: number; // in minutes (+ or - per round)
  baseBreak: number; // in minutes
  breakChange: number; // in minutes (+ or - per round)
}

const defaultPresets: TimerPreset[] = [
  { id: "default", name: "Classic Pomodoro", rounds: 4, baseFocus: 25, focusChange: 0, baseBreak: 5, breakChange: 0 },
  { id: "incremental-break", name: "Incremental Break", rounds: 4, baseFocus: 25, focusChange: 0, baseBreak: 5, breakChange: 5 },
  { id: "decremental-focus", name: "Decremental Focus", rounds: 4, baseFocus: 60, focusChange: -5, baseBreak: 20, breakChange: 0 },
];

interface TimerState {
  // Presets
  presets: TimerPreset[];
  
  // Active Timer State (Only one timer runs at a time globally)
  activePresetId: string | null;
  currentRound: number; // 1-indexed
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number; // in seconds
  endTime: number | null; // unix timestamp in ms
  
  // Actions
  addPreset: (preset: Omit<TimerPreset, "id">) => void;
  updatePreset: (id: string, preset: Omit<TimerPreset, "id">) => void;
  deletePreset: (id: string) => void;
  
  startTimer: (presetId: string) => void;
  pauseTimer: (currentTimeRemaining: number) => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  tick: (currentTimeRemaining: number) => void;
  completePhase: () => void;
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      presets: defaultPresets,
      
      activePresetId: null,
      currentRound: 1,
      phase: "focus",
      status: "idle",
      timeRemaining: 0,
      endTime: null,

      addPreset: (preset) => set((state) => {
        const newPreset = { ...preset, id: crypto.randomUUID() };
        return { presets: [...state.presets, newPreset] };
      }),
      
      updatePreset: (id, preset) => set((state) => {
        const newPresets = state.presets.map((p) => p.id === id ? { ...preset, id } : p);
        return { presets: newPresets };
      }),

      deletePreset: (id) => set((state) => {
        const newPresets = state.presets.filter((p) => p.id !== id);
        // If we delete the currently active preset, reset the timer
        if (state.activePresetId === id) {
          return { presets: newPresets, status: "idle", activePresetId: null, timeRemaining: 0, endTime: null };
        }
        return { presets: newPresets };
      }),

      startTimer: (presetId) => set((state) => {
        const preset = state.presets.find(p => p.id === presetId);
        if (!preset) return state;

        // If starting a brand new preset
        if (state.activePresetId !== presetId || state.status === "idle") {
          const focusDuration = preset.baseFocus * 60;
          return {
            activePresetId: presetId,
            currentRound: 1,
            phase: "focus",
            status: "running",
            timeRemaining: focusDuration,
            endTime: Date.now() + focusDuration * 1000,
          };
        }
        return state;
      }),

      pauseTimer: (currentTimeRemaining) => set(() => ({
        status: "paused",
        timeRemaining: currentTimeRemaining,
        endTime: null,
      })),

      resumeTimer: () => set((state) => ({
        status: "running",
        endTime: Date.now() + state.timeRemaining * 1000,
      })),

      resetTimer: () => set(() => ({
        status: "idle",
        activePresetId: null,
        currentRound: 1,
        timeRemaining: 0,
        endTime: null,
      })),

      tick: (currentTimeRemaining) => set(() => ({
        timeRemaining: currentTimeRemaining,
      })),

      completePhase: () => set((state) => {
        if (!state.activePresetId) return state;
        const preset = state.presets.find(p => p.id === state.activePresetId);
        if (!preset) return state;

        if (state.phase === "focus") {
          // Finished focus, go to break (unless it was the last round)
          if (state.currentRound === preset.rounds) {
            // Done with all rounds!
            return {
              status: "idle",
              activePresetId: null,
              timeRemaining: 0,
              endTime: null,
            };
          } else {
            // Calculate next break duration
            // Break time = baseBreak + (currentRound - 1) * breakChange
            // e.g. round 1 just finished focus. Break for round 1.
            const breakMins = preset.baseBreak + (state.currentRound - 1) * preset.breakChange;
            const breakSecs = Math.max(1, breakMins) * 60; // ensure at least 1 min
            
            return {
              phase: "break",
              timeRemaining: breakSecs,
              endTime: Date.now() + breakSecs * 1000,
            };
          }
        } else {
          // Finished break, go to next focus round
          const nextRound = state.currentRound + 1;
          const focusMins = preset.baseFocus + (nextRound - 1) * preset.focusChange;
          const focusSecs = Math.max(1, focusMins) * 60; // ensure at least 1 min

          return {
            phase: "focus",
            currentRound: nextRound,
            timeRemaining: focusSecs,
            endTime: Date.now() + focusSecs * 1000,
          };
        }
      })
    }),
    {
      name: "pomodoro-storage-v2",
    }
  )
);
