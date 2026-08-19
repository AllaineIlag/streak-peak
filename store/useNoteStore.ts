import { create } from "zustand";
import { Note } from "@/actions/notes";

interface NoteState {
  notes: Note[];
  isHydrated: boolean;
  setInitialData: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  isHydrated: false,
  setInitialData: (notes) => set({ notes, isHydrated: true }),
  addNote: (note) => set((state) => ({ 
    notes: [note, ...state.notes] 
  })),
  updateNote: (id, updates) => set((state) => ({
    notes: state.notes.map((n) => 
      n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n
    ).sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
  })),
  removeNote: (id) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== id)
  })),
}));
