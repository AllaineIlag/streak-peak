"use server";

import { createClient } from "@/utils/supabase/server";

export interface ProfileStats {
  tasksCompleted: number;
  habitCheckins: number;
  focusMinutes: number;
  financeTransactions: number;
}

export async function getProfileStats(): Promise<{ data: ProfileStats | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "Not authenticated" };
    }

    const [
      { count: tasksCompleted },
      { count: habitCheckins },
      { data: focusSessions },
      { count: financeTransactions }
    ] = await Promise.all([
      supabase.from("tasks").select("*", { count: "exact", head: true }).eq("status", "completed"),
      supabase.from("habit_checkins").select("*", { count: "exact", head: true }),
      supabase.from("focus_sessions").select("duration_minutes").eq("status", "completed"),
      supabase.from("finance_transactions").select("*", { count: "exact", head: true })
    ]);

    const focusMinutes = (focusSessions || []).reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return {
      data: {
        tasksCompleted: tasksCompleted || 0,
        habitCheckins: habitCheckins || 0,
        focusMinutes,
        financeTransactions: financeTransactions || 0,
      },
      error: null
    };
  } catch (error: any) {
    console.error("Error fetching profile stats:", error);
    return { data: null, error: error.message };
  }
}
