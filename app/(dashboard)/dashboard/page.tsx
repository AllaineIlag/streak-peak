import { getDashboardData } from "@/actions/dashboard";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { format } from "date-fns";

export const metadata = {
  title: "Dashboard - StreakPeak",
};

export default async function DashboardPage() {
  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const monthStr = format(now, "yyyy-MM");

  const { data, error } = await getDashboardData(dateStr, monthStr);

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's your daily summary.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <DashboardClient data={data} />
        </div>
      </div>
    </div>
  );
}
