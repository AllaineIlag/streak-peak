"use client";

import { useEffect, useRef } from "react";
import { useClockStore, Timezone } from "@/store/useClockStore";

export function ClockInitializer({ timezones }: { timezones: Timezone[] }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useClockStore.getState().setInitialData(timezones);
      initialized.current = true;
    }
  }, [timezones]);

  return null;
}
