import { create } from "zustand";
import { Database } from "@/lib/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];
export type FocusSession = Database["public"]["Tables"]["focus_sessions"]["Row"];

interface EventState {
  events: Event[];
  focusSessions: FocusSession[];
  isHydrated: boolean;

  setInitialData: (events: Event[], focusSessions: FocusSession[]) => void;
  
  // Optimistic UI Actions
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
}

export const useEventStore = create<EventState>((set) => ({
  events: [],
  focusSessions: [],
  isHydrated: false,

  setInitialData: (events, focusSessions) => set({ events, focusSessions, isHydrated: true }),

  addEvent: (event) => set((state) => ({ 
    events: [...state.events, event]
  })),

  updateEvent: (eventId, updates) => set((state) => ({
    events: state.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e))
  })),

  deleteEvent: (eventId) => set((state) => ({
    events: state.events.filter((e) => e.id !== eventId)
  })),
}));
