import { ProfileClient } from "@/components/profile/ProfileClient";

export const metadata = {
  title: "Profile - StreakPeak",
};

export default function ProfilePage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] sm:h-screen flex flex-col overflow-hidden bg-background">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ProfileClient />
      </div>
    </div>
  );
}
