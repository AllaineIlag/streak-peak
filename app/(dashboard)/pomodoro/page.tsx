import { PomodoroGrid } from "@/components/focus/PomodoroGrid";

export const metadata = {
  title: "Focus | StreakPeak",
  description: "Customizable Pomodoro timer for deep work.",
};

export default function PomodoroPage() {
  return (
    <div className="container py-12 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-8">Focus Sessions</h1>
      </div>
      
      <PomodoroGrid />
    </div>
  );
}
