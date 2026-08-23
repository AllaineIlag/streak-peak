import { WeeklyReviewClient } from "@/components/review/WeeklyReviewClient";
import { format, startOfWeek, endOfWeek } from "date-fns";

export const metadata = {
  title: "Weekly Review - StreakPeak",
};

export default async function WeeklyReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>;
}) {
  const resolvedParams = await searchParams;
  const referenceDate = resolvedParams.week ? new Date(resolvedParams.week) : new Date();
  
  const start = startOfWeek(referenceDate, { weekStartsOn: 0 });
  const end = endOfWeek(referenceDate, { weekStartsOn: 0 });
  
  const startDateStr = format(start, "yyyy-MM-dd");
  const endDateStr = format(end, "yyyy-MM-dd");

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Weekly Review</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <WeeklyReviewClient 
          startDate={startDateStr}
          endDate={endDateStr}
        />
      </div>
    </div>
  );
}
