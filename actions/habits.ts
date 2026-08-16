"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createHabit(title: string, emoji: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("habits")
    .insert({
      title,
      emoji,
      user_id: user.id,
      frequency: "daily",
    });

  if (error) throw new Error(error.message);
  revalidatePath("/habits");
}

export async function toggleHabitCheckin(habitId: string, date: string, currentStatus: boolean) {
  const supabase = await createClient();
  
  if (currentStatus) {
    // If it's already checked in, delete the record to uncheck it
    const { error } = await supabase
      .from("habit_checkins")
      .delete()
      .match({ habit_id: habitId, date });
      
    if (error) throw new Error(error.message);
  } else {
    // If it's not checked in, insert a new record
    const { error } = await supabase
      .from("habit_checkins")
      .insert({
        habit_id: habitId,
        date,
        status: "completed",
      });
      
    if (error) throw new Error(error.message);
  }

  revalidatePath("/habits");
}

export async function deleteHabit(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/habits");
}
