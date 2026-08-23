import { WorldClockGrid } from "@/components/clocks/WorldClockGrid";
import { UtilityTimers } from "@/components/clocks/UtilityTimers";

export const metadata = {
  title: "Clocks & Timers - Streak Peak",
};

export default function ClocksPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Clocks & Timers</h2>
        <p className="text-muted-foreground mt-1">Keep track of time globally and run local timers.</p>
      </div>

      <div className="flex flex-col gap-10">
        <WorldClockGrid />
        <div className="border-t pt-8">
          <UtilityTimers />
        </div>
      </div>
    </div>
  );
}
