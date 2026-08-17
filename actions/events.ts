"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEvent(data: { title: string; description?: string; start_time: string; end_time: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title: data.title,
      description: data.description || null,
      start_time: data.start_time,
      end_time: data.end_time,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
  return event;
}

export async function updateEvent(id: string, data: { title?: string; description?: string; start_time?: string; end_time?: string }) {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from("events")
    .update({ ...data })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
  return event;
}

export async function deleteEvent(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/calendar");
}
