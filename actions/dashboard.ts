"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDashboardData(dateStr: string, monthStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const [
    { data: tasks },
    { data: habits },
    { data: habitCheckins },
    { data: financeTransactions },
    { data: mood },
    { data: events }
  ] = await Promise.all([
    supabase.from("tasks").select("*").eq("due_date", dateStr),
    supabase.from("habits").select("*"),
    supabase.from("habit_checkins").select("*").eq("date", dateStr),
    supabase.from("finance_transactions").select("*").gte("date", `${monthStr}-01`).lte("date", `${monthStr}-31`),
    supabase.from("mood_logs").select("*").eq("date", dateStr).maybeSingle(),
    supabase.from("events").select("*").gte("start_time", `${dateStr}T00:00:00Z`).lte("end_time", `${dateStr}T23:59:59Z`)
  ]);

  return {
    data: {
      tasks: tasks || [],
      habits: habits || [],
      habitCheckins: habitCheckins || [],
      financeTransactions: financeTransactions || [],
      mood: mood || null,
      events: events || []
    },
    error: null
  };
}
