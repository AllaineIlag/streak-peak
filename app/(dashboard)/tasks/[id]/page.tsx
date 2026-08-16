import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { TaskDetailsClient } from "@/components/tasks/TaskDetailsClient";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  // Note: Middleware already guarantees the user is authenticated.
  // We rely on Supabase Row Level Security (RLS) to automatically filter tasks for the logged-in user.

  const { data: task, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !task) {
    notFound();
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <TaskDetailsClient task={task} />
    </div>
  );
}
