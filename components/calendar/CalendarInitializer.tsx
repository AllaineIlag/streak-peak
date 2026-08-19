"use client";

import { useEffect, useRef } from "react";
import { useEventStore, Event, FocusSession } from "@/store/useEventStore";

export function CalendarInitializer({
  events,
  focusSessions,
}: {
  events: Event[];
  focusSessions: FocusSession[];
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useEventStore.getState().setInitialData(events, focusSessions);
      initialized.current = true;
    }
  }, [events, focusSessions]);

  return null;
}
