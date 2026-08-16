import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { AddHabitForm } from "@/components/habits/AddHabitForm";
import { HabitsList } from "@/components/habits/HabitsList";
import { HabitsSkeleton } from "@/components/habits/HabitsSkeleton";

// The async Server Component that fetches data
async function HabitsDataFetcher() {
  const supabase = await createClient();
  
  // Note: Middleware already guarantees the user is authenticated.
  // We rely on Supabase Row Level Security (RLS) to automatically filter habits for the logged-in user.

  // Fetch habits and check-ins in parallel to eliminate waterfall delays
  const [
    { data: habits, error: habitsError },
    { data: checkins, error: checkinsError }
  ] = await Promise.all([
    supabase.from("habits").select("*").order("created_at", { ascending: true }),
    supabase.from("habit_checkins").select("*").order("date", { ascending: false })
  ]);

  if (habitsError) {
    console.error("Error fetching habits:", habitsError);
    return <div>Error loading habits.</div>;
  }

  if (checkinsError) {
    console.error("Error fetching checkins:", checkinsError);
    return <div>Error loading check-ins.</div>;
  }

  return <HabitsList habits={habits || []} checkins={checkins || []} />;
}

// The main Page Component that renders instantly
export default function HabitsPage() {
  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <AddHabitForm />
      <Suspense fallback={<HabitsSkeleton />}>
        <HabitsDataFetcher />
      </Suspense>
    </div>
  );
}
