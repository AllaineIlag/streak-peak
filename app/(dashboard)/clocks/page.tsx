import { Suspense } from "react";
import { getTimezones } from "@/actions/timezones";
import { ClockInitializer } from "@/components/clocks/ClockInitializer";
import { WorldClockGrid } from "@/components/clocks/WorldClockGrid";
import { UtilityTimers } from "@/components/clocks/UtilityTimers";

export const metadata = {
  title: "Clocks & Timers - Streak Peak",
};

async function ClockDataFetcher() {
  const timezones = await getTimezones();

  return (
    <>
      <ClockInitializer timezones={timezones} />
      <div className="flex flex-col gap-10">
        <WorldClockGrid />
        <div className="border-t pt-8">
          <UtilityTimers />
        </div>
      </div>
    </>
  );
}

export default function ClocksPage() {
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Clocks & Timers</h2>
        <p className="text-muted-foreground mt-1">Keep track of time globally and run local timers.</p>
      </div>

      <Suspense fallback={
        <div className="py-20 text-center text-muted-foreground animate-pulse flex flex-col gap-4 items-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          Loading your clocks...
        </div>
      }>
        <ClockDataFetcher />
      </Suspense>
    </div>
  );
}
