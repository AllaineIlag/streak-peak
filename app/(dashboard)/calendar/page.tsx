import { CalendarTimeline } from "@/components/calendar/CalendarTimeline";

export default function CalendarPage() {
  return (
    <div className="container max-w-5xl mx-auto flex flex-col gap-4 h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
      </div>
      
      <div className="flex-1 min-h-0 bg-card border rounded-xl overflow-hidden flex flex-col shadow-sm">
        <CalendarTimeline />
      </div>
    </div>
  );
}
