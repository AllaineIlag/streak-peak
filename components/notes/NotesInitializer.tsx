"use client";

import { useEffect, useRef } from "react";
import { useNoteStore } from "@/store/useNoteStore";
import { Note } from "@/actions/notes";

export function NotesInitializer({ notes }: { notes: Note[] }) {
  const isHydrated = useNoteStore((state) => state.isHydrated);
  const setInitialData = useNoteStore((state) => state.setInitialData);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && !isHydrated) {
      setInitialData(notes);
      initialized.current = true;
    }
  }, [notes, isHydrated, setInitialData]);

  return null;
}
