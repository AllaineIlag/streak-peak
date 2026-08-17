"use client";

import { useTransition } from "react";
import { Database } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toggleHabitCheckin, deleteHabit } from "@/actions/habits";
import { calculateCurrentStreak, getLastNDays } from "@/utils/streaks";
import { cn } from "@/lib/utils";

import { useHabitStore } from "@/store/useHabitStore";

export function HabitsList() {
  const [isPending, startTransition] = useTransition();
  const { habits, checkins, isHydrated, toggleCheckin, deleteHabit: deleteHabitOptimistic } = useHabitStore();

  const last7Days = getLastNDays(7);
  const today = last7Days[last7Days.length - 1];

  const handleToggleCheckin = (habitId: string, date: string, currentStatus: boolean) => {
    // Optimistic Update
    toggleCheckin(habitId, date, currentStatus);

    startTransition(async () => {
      try {
        await toggleHabitCheckin(habitId, date, currentStatus);
      } catch (err) {
        // Revert on failure
        toggleCheckin(habitId, date, !currentStatus);
        console.error("Failed to toggle checkin:", err);
      }
    });
  };

  const handleDeleteHabit = (habitId: string) => {
    if (!confirm("Delete this habit forever?")) return;
    
    // Optimistic update
    deleteHabitOptimistic(habitId);

    startTransition(async () => {
      try {
        await deleteHabit(habitId);
      } catch (err) {
        // Refresh page or handle error properly to restore state since we don't store the deleted habit locally easily
        console.error("Failed to delete habit:", err);
      }
    });
  };

  if (!isHydrated) return null;

  if (habits.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
        <p className="text-center text-muted-foreground py-12 border rounded-xl border-dashed">
          No habits yet. Start tracking something new today!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
      {habits.map((habit) => {
        const habitCheckins = checkins.filter((c) => c.habit_id === habit.id);
        const streak = calculateCurrentStreak(habitCheckins.map((c) => c.date));

        return (
          <div key={habit.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-sm">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                {habit.emoji}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{habit.title}</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  🔥 {streak} day streak
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-1.5">
                {last7Days.map((dateStr) => {
                  const isChecked = habitCheckins.some((c) => c.date === dateStr);
                  const isToday = dateStr === today;
                  const label = new Date(dateStr).toLocaleDateString("en-US", { weekday: "narrow" });

                  return (
                    <div key={dateStr} className="flex flex-col items-center gap-1">
                      <span className={cn("text-[10px] font-medium text-muted-foreground", isToday && "text-primary font-bold")}>
                        {label}
                      </span>
                      <button
                        onClick={() => handleToggleCheckin(habit.id, dateStr, isChecked)}
                        disabled={isPending}
                        className={cn(
                          "h-8 w-8 rounded-md flex items-center justify-center transition-all",
                          isChecked ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted hover:bg-muted/80 text-transparent",
                          isToday && !isChecked && "border-2 border-primary/50 bg-background"
                        )}
                      >
                        {isChecked && <span className="text-sm">✓</span>}
                      </button>
                    </div>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hidden md:flex"
                onClick={() => handleDeleteHabit(habit.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
