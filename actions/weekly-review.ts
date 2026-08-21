"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
import { revalidatePath } from "next/cache";

export type WeeklyReview = Database["public"]["Tables"]["weekly_reviews"]["Row"];

export interface WeeklyMetrics {
  tasksCompleted: number;
  habitCheckins: number;
  netSavings: number;
  averageMood: number;
  focusMinutes: number;
}

export async function getWeeklyReview(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("weekly_reviews")
    .select("*")
    .eq("start_date", startDate)
    .eq("end_date", endDate)
    .single();

  if (error && error.code !== "PGRST116") { // Ignore 'Not found' error
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function calculateWeeklyMetrics(startDate: string, endDate: string): Promise<{ data: WeeklyMetrics | null, error: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  // 1. Tasks completed (status = 'done', updated_at between start and end? Or just tasks that were marked done. We don't track completion date perfectly, but let's assume if it's done and updated within the week)
  const { data: tasks } = await supabase
    .from("tasks")
    .select("id")
    .eq("status", "done")
    .gte("updated_at", `${startDate}T00:00:00Z`)
    .lte("updated_at", `${endDate}T23:59:59Z`);

  // 2. Habit check-ins
  const { data: checkins } = await supabase
    .from("habit_checkins")
    .select("id")
    .gte("date", startDate)
    .lte("date", endDate);

  // 3. Finance (net savings)
  const { data: transactions } = await supabase
    .from("finance_transactions")
    .select("amount, type")
    .gte("date", startDate)
    .lte("date", endDate);

  let netSavings = 0;
  if (transactions) {
    netSavings = transactions.reduce((acc, t) => {
      return t.type === "income" ? acc + t.amount : acc - t.amount;
    }, 0);
  }

  // 4. Mood
  const { data: moods } = await supabase
    .from("mood_logs")
    .select("rating")
    .gte("date", startDate)
    .lte("date", endDate);

  let averageMood = 0;
  if (moods && moods.length > 0) {
    averageMood = moods.reduce((acc, m) => acc + m.rating, 0) / moods.length;
  }

  // 5. Focus sessions
  const { data: focus } = await supabase
    .from("focus_sessions")
    .select("duration_minutes")
    .gte("started_at", `${startDate}T00:00:00Z`)
    .lte("ended_at", `${endDate}T23:59:59Z`);

  let focusMinutes = 0;
  if (focus) {
    focusMinutes = focus.reduce((acc, f) => acc + f.duration_minutes, 0);
  }

  return {
    data: {
      tasksCompleted: tasks?.length || 0,
      habitCheckins: checkins?.length || 0,
      netSavings,
      averageMood,
      focusMinutes,
    },
    error: null
  };
}

export async function saveWeeklyReview(
  startDate: string,
  endDate: string,
  metrics: WeeklyMetrics,
  reflection: any
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  // Check existing
  const { data: existing } = await supabase
    .from("weekly_reviews")
    .select("id")
    .eq("start_date", startDate)
    .eq("end_date", endDate)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from("weekly_reviews")
      .update({ metrics: metrics as any, reflection })
      .eq("id", existing.id)
      .select()
      .single();
    if (!error) revalidatePath("/review");
    return { data, error };
  }

  const { data, error } = await supabase
    .from("weekly_reviews")
    .insert([{
      user_id: user.id,
      start_date: startDate,
      end_date: endDate,
      metrics: metrics as any,
      reflection
    }])
    .select()
    .single();

  if (!error) revalidatePath("/review");
  return { data, error };
}
