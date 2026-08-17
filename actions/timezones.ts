"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTimezones() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("timezones")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching timezones:", error);
    return [];
  }
  return data;
}

export async function addTimezone(timezone: string) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("timezones")
    .insert({ user_id: user.id, timezone })
    .select()
    .single();

  if (error) {
    console.error("Error adding timezone:", error);
    return { error: error.message };
  }

  revalidatePath("/clocks");
  return { data };
}

export async function removeTimezone(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("timezones")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error removing timezone:", error);
    return { error: error.message };
  }

  revalidatePath("/clocks");
  return { success: true };
}
