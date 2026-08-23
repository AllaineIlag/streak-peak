import { getMoodLogs } from "@/actions/mood";
import { MoodClient } from "@/components/mood/MoodClient";

export const metadata = {
  title: "Mood Tracker - StreakPeak",
};

export default function MoodPage() {
  const now = new Date();
  const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Mood</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <MoodClient currentMonthStr={currentMonthStr} />
      </div>
    </div>
  );
}
