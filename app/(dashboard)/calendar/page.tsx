import { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import { CalendarInitializer } from "@/components/calendar/CalendarInitializer";
import { CalendarTimeline } from "@/components/calendar/CalendarTimeline";

async function CalendarDataFetcher() {
  const supabase = await createClient();
  
  const [
    { data: events, error: eventsError },
    { data: focusSessions, error: focusSessionsError }
  ] = await Promise.all([
    supabase.from("events").select("*").order("start_time", { ascending: true }),
    supabase.from("focus_sessions").select("*").eq("status", "completed").order("started_at", { ascending: true })
  ]);

  if (eventsError) {
    console.error("Error fetching events:", eventsError);
    return <div>Error loading calendar events.</div>;
  }

  if (focusSessionsError) {
    console.error("Error fetching focus sessions:", focusSessionsError);
    return <div>Error loading focus sessions.</div>;
  }

  return (
    <>
      <CalendarInitializer events={events || []} focusSessions={focusSessions || []} />
      <CalendarTimeline />
    </>
  );
}

export default function CalendarPage() {
  return (
    <div className="container max-w-5xl mx-auto flex flex-col gap-4 h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
      </div>
      
      <div className="flex-1 min-h-0 bg-card border rounded-xl overflow-hidden flex flex-col shadow-sm">
        <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading calendar...</div>}>
          <CalendarDataFetcher />
        </Suspense>
      </div>
    </div>
  );
}
