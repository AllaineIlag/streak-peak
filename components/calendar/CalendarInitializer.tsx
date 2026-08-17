"use client";

import { useRef } from "react";
import { useEventStore, Event, FocusSession } from "@/store/useEventStore";

export function CalendarInitializer({
  events,
  focusSessions,
}: {
  events: Event[];
  focusSessions: FocusSession[];
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    useEventStore.getState().setInitialData(events, focusSessions);
    initialized.current = true;
  }

  return null;
}
