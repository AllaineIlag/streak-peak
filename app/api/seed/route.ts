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

  // Seed Focus Sessions (Pomodoro)
  const focusSessionsToInsert = [];
  const today = new Date();
  
  // Create 5 mock sessions over the last 3 days
  for (let i = 0; i < 5; i++) {
    const sessionDate = new Date(today);
    sessionDate.setDate(sessionDate.getDate() - (i % 3)); // Spread over last 3 days
    sessionDate.setHours(10 + i, 0, 0, 0); // Start at 10 AM, 11 AM, etc.
    
    const durationMinutes = i % 2 === 0 ? 25 : 50; // Mix of 25m and 50m sessions
    
    const endedAt = new Date(sessionDate.getTime() + durationMinutes * 60 * 1000);
    
    focusSessionsToInsert.push({
      user_id: user.id,
      duration_minutes: durationMinutes,
      started_at: sessionDate.toISOString(),
      ended_at: endedAt.toISOString(),
      status: "completed"
    });
  }

  const { error: focusError } = await supabase.from("focus_sessions").insert(focusSessionsToInsert);
  if (focusError) {
    return NextResponse.json({ error: focusError.message }, { status: 500 });
  }

  // Seed Calendar Events
  const eventsToInsert = [];
  
  // Event 1: Morning Standup (10:00 AM - 10:30 AM today)
  const event1Start = new Date(today);
  event1Start.setHours(10, 0, 0, 0);
  const event1End = new Date(today);
  event1End.setHours(10, 30, 0, 0);
  
  // Event 2: Deep Work Block (1:00 PM - 3:00 PM today)
  const event2Start = new Date(today);
  event2Start.setHours(13, 0, 0, 0);
  const event2End = new Date(today);
  event2End.setHours(15, 0, 0, 0);
  
  // Event 3: Gym (5:30 PM - 7:00 PM today)
  const event3Start = new Date(today);
  event3Start.setHours(17, 30, 0, 0);
  const event3End = new Date(today);
  event3End.setHours(19, 0, 0, 0);

  eventsToInsert.push({
    user_id: user.id,
    title: "Morning Standup",
    description: "Daily team sync to discuss blockers.",
    start_time: event1Start.toISOString(),
    end_time: event1End.toISOString()
  });

  eventsToInsert.push({
    user_id: user.id,
    title: "Deep Work Block",
    description: "No interruptions allowed.",
    start_time: event2Start.toISOString(),
    end_time: event2End.toISOString()
  });

  eventsToInsert.push({
    user_id: user.id,
    title: "Gym / Workout",
    description: "Leg day!",
    start_time: event3Start.toISOString(),
    end_time: event3End.toISOString()
  });

  const { error: eventsError } = await supabase.from("events").insert(eventsToInsert);
  if (eventsError) {
    return NextResponse.json({ error: eventsError.message }, { status: 500 });
  }

  // Redirect to calendar after seeding
  return NextResponse.redirect(new URL("/calendar", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
