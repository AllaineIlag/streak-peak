"use server";

import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
import { revalidatePath } from "next/cache";

export type MoodLog = Database["public"]["Tables"]["mood_logs"]["Row"];

export async function getMoodLogs(monthStr?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  let query = supabase
    .from("mood_logs")
    .select("*")
    .order("date", { ascending: false });

  if (monthStr) {
    // monthStr in format YYYY-MM
    const startDate = `${monthStr}-01`;
    const year = parseInt(monthStr.split("-")[0]);
    const month = parseInt(monthStr.split("-")[1]);
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${monthStr}-${lastDay}`;
    
    query = query.gte("date", startDate).lte("date", endDate);
  }

  const { data, error } = await query;
  return { data, error };
}

export async function createMoodLog(date: string, rating: number, note: string | null = null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  // Check if a mood log already exists for this date
  const { data: existingLog } = await supabase
    .from("mood_logs")
    .select("*")
    .eq("date", date)
    .single();

  if (existingLog) {
    // Update existing
    const { data, error } = await supabase
      .from("mood_logs")
      .update({ rating, note })
      .eq("id", existingLog.id)
      .select()
      .single();

    if (!error) revalidatePath("/mood");
    return { data, error };
  }

  // Insert new
  const { data, error } = await supabase
    .from("mood_logs")
    .insert([
      {
        user_id: user.id,
        date,
        rating,
        note
      }
    ])
    .select()
    .single();

  if (!error) revalidatePath("/mood");
  return { data, error };
}

export async function updateMoodLog(id: string, updates: Partial<MoodLog>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("mood_logs")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (!error) revalidatePath("/mood");
  return { data, error };
}

export async function deleteMoodLog(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("mood_logs")
    .delete()
    .eq("id", id);

  if (!error) revalidatePath("/mood");
  return { error };
}
