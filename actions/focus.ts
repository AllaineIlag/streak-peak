"use server";

import { createClient } from "@/utils/supabase/server";

export async function logFocusSession(durationMinutes: number, startedAt: string, endedAt: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("focus_sessions").insert({
    user_id: user.id,
    duration_minutes: durationMinutes,
    started_at: startedAt,
    ended_at: endedAt,
    status: "completed"
  });

  if (error) {
    console.error("Error logging focus session:", error);
    throw new Error("Failed to log focus session");
  }
}
