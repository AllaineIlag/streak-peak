"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { Database } from "@/lib/database.types";
import { Json } from "@/lib/database.types";

export type Note = Database["public"]["Tables"]["notes"]["Row"];

export async function getNotes() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function createNote(title: string, content: Json = null, tags: string[] = []) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase
    .from("notes")
    .insert([
      {
        user_id: user.id,
        title,
        content,
        tags
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/notes");
  return { data, error: null };
}

export async function updateNote(id: string, updates: { title?: string; content?: Json; tags?: string[] }) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    return { data: null, error: error.message };
  }

  revalidatePath("/notes");
  return { data, error: null };
}

export async function deleteNote(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return { error: error.message };
  }

  revalidatePath("/notes");
  return { error: null };
}
