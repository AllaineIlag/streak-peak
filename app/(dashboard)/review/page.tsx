import { WeeklyReviewClient } from "@/components/review/WeeklyReviewClient";
import { format, startOfWeek, endOfWeek, subWeeks } from "date-fns";

export const metadata = {
  title: "Weekly Review - StreakPeak",
};

export default async function WeeklyReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>; // expects ISO date string for a day in the week
}) {
  const resolvedParams = await searchParams;
  const referenceDate = resolvedParams.week ? new Date(resolvedParams.week) : new Date();
  
  // Default to the previous week if not explicitly set, 
  // because you typically review the week that just passed.
  // Wait, if searchParams is empty, maybe default to current week? Let's use current week, user can step back.
  
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 }); // Sunday start
  const end = endOfWeek(referenceDate, { weekStartsOn: 0 });

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Weekly Review</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <WeeklyReviewClient 
          startDate={format(start, "yyyy-MM-dd")}
          endDate={format(end, "yyyy-MM-dd")}
        />
      </div>
    </div>
  );
}
