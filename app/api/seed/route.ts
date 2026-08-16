import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Seed Tasks
  const tasksToInsert = [
    { user_id: user.id, title: "Finalize Q3 Marketing Report", status: "active", priority: "High" },
    { user_id: user.id, title: "Buy groceries for the week", status: "active", priority: "Medium" },
    { user_id: user.id, title: "Schedule dentist appointment", status: "completed", priority: "Low" },
  ];

  const { data: insertedTasks, error: tasksError } = await supabase
    .from("tasks")
    .insert(tasksToInsert)
    .select();

  if (tasksError) {
    return NextResponse.json({ error: tasksError.message }, { status: 500 });
  }

  // Seed Subtasks for the first task
  if (insertedTasks && insertedTasks.length > 0) {
    const mainTask = insertedTasks[0];
    const subtasksToInsert = [
      { task_id: mainTask.id, title: "Gather data from Analytics", is_completed: true },
      { task_id: mainTask.id, title: "Draft executive summary", is_completed: false },
      { task_id: mainTask.id, title: "Create presentation slides", is_completed: false },
    ];
    await supabase.from("subtasks").insert(subtasksToInsert);
  }

  // Seed Habits
  const habitsToInsert = [
    { user_id: user.id, title: "Read 10 pages", emoji: "📚" },
    { user_id: user.id, title: "Workout", emoji: "🏋️‍♂️" },
    { user_id: user.id, title: "Drink 2L Water", emoji: "💧" },
  ];

  const { data: insertedHabits, error: habitsError } = await supabase
    .from("habits")
    .insert(habitsToInsert)
    .select();

  if (habitsError) {
    return NextResponse.json({ error: habitsError.message }, { status: 500 });
  }

  // Seed Habit Check-ins for the last 7 days to show streaks
  if (insertedHabits && insertedHabits.length > 0) {
    const checkinsToInsert = [];
    const today = new Date();
    
    // Read 10 pages: Perfect 7 day streak
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      checkinsToInsert.push({ habit_id: insertedHabits[0].id, date: dateStr, status: 'completed' });
    }

    // Workout: Every other day
    for (let i = 0; i < 7; i += 2) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      checkinsToInsert.push({ habit_id: insertedHabits[1].id, date: dateStr, status: 'completed' });
    }

    await supabase.from("habit_checkins").insert(checkinsToInsert);
  }

  // Redirect to dashboard after seeding
  return NextResponse.redirect(new URL("/dashboard", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
