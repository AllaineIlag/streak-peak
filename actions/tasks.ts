"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title,
      user_id: user.id,
      status: "active",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  return data;
}

export async function updateTaskStatus(id: string, status: "active" | "completed") {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function createSubtask(taskId: string, title: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subtasks")
    .insert({
      title,
      task_id: taskId,
      is_completed: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  return data;
}

export async function toggleSubtask(id: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("subtasks")
    .update({ is_completed: isCompleted })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function updateTaskDetails(id: string, data: { title: string; description: string | null; priority: string | null; due_date: string | null; labels: string[] | null }) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath(`/tasks/${id}`);
}

export async function deleteTask(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}
