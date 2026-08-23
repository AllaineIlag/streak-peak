"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { LogOut, Monitor, Moon, Sun, Trophy, Target, Flame, Wallet, CheckCircle, Loader2 } from "lucide-react";
import { getProfileData, ProfileStats } from "@/actions/profile";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/store/useProfileStore";

const ACHIEVEMENTS = [
  {
    id: "tasks-10",
    title: "Task Master",
    description: "Complete 10 tasks",
    icon: CheckCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    check: (s: ProfileStats) => s.tasksCompleted >= 10,
    progress: (s: ProfileStats) => Math.min(100, (s.tasksCompleted / 10) * 100)
  },
  {
    id: "tasks-100",
    title: "Task Grandmaster",
    description: "Complete 100 tasks",
    icon: Trophy,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    check: (s: ProfileStats) => s.tasksCompleted >= 100,
    progress: (s: ProfileStats) => Math.min(100, (s.tasksCompleted / 100) * 100)
  },
  {
    id: "habit-10",
    title: "Habit Starter",
    description: "Check in 10 habits",
    icon: Flame,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    check: (s: ProfileStats) => s.habitCheckins >= 10,
    progress: (s: ProfileStats) => Math.min(100, (s.habitCheckins / 10) * 100)
  },
  {
    id: "habit-50",
    title: "Consistency",
    description: "Check in 50 habits",
    icon: Target,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    check: (s: ProfileStats) => s.habitCheckins >= 50,
    progress: (s: ProfileStats) => Math.min(100, (s.habitCheckins / 50) * 100)
  },
  {
    id: "focus-60",
    title: "Focus Novice",
    description: "Log 60 minutes of focus time",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    check: (s: ProfileStats) => s.focusMinutes >= 60,
    progress: (s: ProfileStats) => Math.min(100, (s.focusMinutes / 60) * 100)
  },
  {
    id: "focus-500",
    title: "Focus Champion",
    description: "Log 500 minutes of focus time",
    icon: Sun,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    check: (s: ProfileStats) => s.focusMinutes >= 500,
    progress: (s: ProfileStats) => Math.min(100, (s.focusMinutes / 500) * 100)
  },
  {
    id: "finance-1",
    title: "Financial Awareness",
    description: "Log your first financial transaction",
    icon: Wallet,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    check: (s: ProfileStats) => s.financeTransactions >= 1,
    progress: (s: ProfileStats) => Math.min(100, (s.financeTransactions / 1) * 100)
  },
];

export function ProfileClient() {
  const { email, stats, isHydrated, setInitialData } = useProfileStore();
  const [loading, setLoading] = useState(!isHydrated);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      if (!isHydrated) setLoading(true);
      
      const { data } = await getProfileData();
      
      if (isMounted) {
        if (data) {
          setInitialData(data.email, data.stats);
        }
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [isHydrated, setInitialData]);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!isHydrated && loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground/50" />
      </div>
    );
  }

  const currentStats = stats || { tasksCompleted: 0, habitCheckins: 0, focusMinutes: 0, financeTransactions: 0 };
  const currentEmail = email || "Unknown User";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Account Section */}
      <section className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Account</h2>
          <p className="text-sm text-muted-foreground">Manage your account details and preferences.</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email Address</label>
            <p className="font-medium mt-1">{currentEmail}</p>
          </div>
          
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors pt-2"
          >
            {isSigningOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            Sign Out
          </button>
        </div>
      </section>

      {/* Appearance Section */}
      <section className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Appearance</h2>
          <p className="text-sm text-muted-foreground">Customize how StreakPeak looks on your device.</p>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <ThemeOption
            icon={Sun}
            label="Light"
            selected={mounted && theme === "light"}
            onClick={() => setTheme("light")}
          />
          <ThemeOption
            icon={Moon}
            label="Dark"
            selected={mounted && theme === "dark"}
            onClick={() => setTheme("dark")}
          />
          <ThemeOption
            icon={Monitor}
            label="System"
            selected={mounted && theme === "system"}
            onClick={() => setTheme("system")}
          />
        </div>
      </section>

      {/* Achievements Section */}
      <section className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Achievements</h2>
          <p className="text-sm text-muted-foreground">Unlock badges by reaching milestones in StreakPeak.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map(ach => {
            const unlocked = ach.check(currentStats);
            const progress = ach.progress(currentStats);
            
            return (
              <div 
                key={ach.id} 
                className={`border rounded-xl p-4 flex gap-4 transition-all duration-300 ${
                  unlocked 
                    ? `border-border bg-card` 
                    : `border-transparent bg-muted/50 opacity-70 grayscale-[0.8]`
                }`}
              >
                <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${unlocked ? ach.bg : 'bg-muted-foreground/20'}`}>
                  <ach.icon className={`w-6 h-6 ${unlocked ? ach.color : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm">{ach.title}</h3>
                    <p className="text-xs text-muted-foreground">{ach.description}</p>
                  </div>
                  
                  {!unlocked && (
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${ach.bg.replace('/10', '')} opacity-50`} 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}
                  {unlocked && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-green-500/80 mt-1">Unlocked</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

function ThemeOption({ 
  icon: Icon, 
  label, 
  selected, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  selected: boolean, 
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
        selected 
          ? "border-primary bg-primary/5 text-primary" 
          : "border-border hover:border-muted-foreground/30 text-muted-foreground"
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
