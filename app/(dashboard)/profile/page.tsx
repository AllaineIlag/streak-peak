import { getProfileStats } from "@/actions/profile";
import { ProfileClient } from "@/components/profile/ProfileClient";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "Profile - StreakPeak",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: stats } = await getProfileStats();

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProfileClient email={user?.email || "Unknown User"} initialStats={stats} />
      </div>
    </div>
  );
}
