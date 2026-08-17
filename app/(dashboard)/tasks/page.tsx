import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { TasksList } from "@/components/tasks/TasksList";
import { TasksSkeleton } from "@/components/tasks/TasksSkeleton";

import { TasksInitializer } from "@/components/tasks/TasksInitializer";

// The async Server Component that fetches data
async function TasksDataFetcher() {
  const supabase = await createClient();

  // Fetch tasks and subtasks in parallel to eliminate waterfall delays
  const [
    { data: tasks, error: tasksError },
    { data: subtasks, error: subtasksError }
  ] = await Promise.all([
    supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    supabase.from("subtasks").select("*").order("created_at", { ascending: true })
  ]);

  if (tasksError) {
    console.error("Error fetching tasks:", tasksError);
    return <div>Error loading tasks.</div>;
  }

  if (subtasksError) {
    console.error("Error fetching subtasks:", subtasksError);
    return <div>Error loading subtasks.</div>;
  }

  return (
    <>
      <TasksInitializer tasks={tasks || []} subtasks={subtasks || []} />
      <TasksList />
    </>
  );
}

// The main Page Component that renders instantly
export default function TasksPage() {
  return (
    <div className="container py-8 max-w-2xl mx-auto space-y-8">
      <AddTaskForm />
      <Suspense fallback={<TasksSkeleton />}>
        <TasksDataFetcher />
      </Suspense>
    </div>
  );
}
