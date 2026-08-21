"use client";

import { useEffect, useRef, useState } from "react";
import { MoodLog, createMoodLog, deleteMoodLog } from "@/actions/mood";
import { useMoodStore } from "@/store/useMoodStore";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  parseISO,
  startOfWeek,
  endOfWeek
} from "date-fns";
import { ChevronLeft, ChevronRight, Smile, Trash2 } from "lucide-react";
import { clsx } from "clsx";

interface MoodClientProps {
  initialLogs: MoodLog[];
  currentMonthStr: string;
}

const MOOD_EMOJIS = {
  1: "😄", // Good / Great
  2: "🙂", // Good
  3: "😐", // Neutral
  4: "🙁", // Bad
  5: "😞", // Awful
};

const MOOD_LABELS = {
  1: "Great",
  2: "Good",
  3: "Neutral",
  4: "Bad",
  5: "Awful",
};

export function MoodClient({ initialLogs, currentMonthStr }: MoodClientProps) {
  const { logs, isHydrated, setInitialData, addOrUpdateLog, removeLog } = useMoodStore();
  const initialized = useRef(false);

  // Parse currentMonthStr (e.g. "2026-08") to get initial current month view
  const [currentMonth, setCurrentMonth] = useState(() => {
    const [year, month] = currentMonthStr.split("-");
    return new Date(parseInt(year), parseInt(month) - 1, 1);
  });
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Form State for selectedDate
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!initialized.current && !isHydrated) {
      setInitialData(initialLogs);
      initialized.current = true;
    }
  }, [initialLogs, isHydrated, setInitialData]);

  const displayLogs = isHydrated ? logs : initialLogs;
  
  // Find log for selected date
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const currentLog = displayLogs.find(l => l.date === selectedDateStr);

  useEffect(() => {
    if (currentLog) {
      setRating(currentLog.rating);
      setNote(currentLog.note || "");
    } else {
      setRating(null);
      setNote("");
    }
  }, [currentLog, selectedDateStr]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    
    setIsSubmitting(true);
    
    const tempId = currentLog ? currentLog.id : `temp-${Date.now()}`;
    const newLog: MoodLog = {
      id: tempId,
      user_id: "",
      date: selectedDateStr,
      rating,
      note: note || null,
      created_at: new Date().toISOString()
    };
    
    // Optimistic update
    addOrUpdateLog(newLog);
    
    // Server action
    const res = await createMoodLog(selectedDateStr, rating, note || null);
    if (res.data && !currentLog) {
       // Replace temp with real
       useMoodStore.setState(state => ({
         logs: state.logs.map(l => l.id === tempId ? res.data! : l)
       }));
    }
    
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!currentLog) return;
    if (confirm("Delete this mood log?")) {
      removeLog(currentLog.id);
      await deleteMoodLog(currentLog.id);
      setRating(null);
      setNote("");
    }
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Calendar View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-muted rounded-md transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-muted rounded-md transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 auto-rows-[6rem]">
              {days.map((day, idx) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const dayLog = displayLogs.find(l => l.date === dayStr);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, currentMonth);

                return (
                  <button
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={clsx(
                      "border-b border-r border-border p-2 flex flex-col items-start justify-start hover:bg-muted/50 transition-colors relative",
                      !isCurrentMonth && "opacity-40 bg-muted/20",
                      isSelected && "ring-2 ring-primary ring-inset z-10 bg-primary/5 hover:bg-primary/5",
                      idx % 7 === 6 && "border-r-0"
                    )}
                  >
                    <span className={clsx(
                      "text-sm w-6 h-6 flex items-center justify-center rounded-full font-medium mb-1",
                      isToday(day) ? "bg-primary text-primary-foreground" : ""
                    )}>
                      {format(day, "d")}
                    </span>
                    
                    {dayLog && (
                      <div className="w-full flex-1 flex flex-col items-center justify-center -mt-2">
                        <span className="text-3xl" title={MOOD_LABELS[dayLog.rating as keyof typeof MOOD_LABELS]}>
                          {MOOD_EMOJIS[dayLog.rating as keyof typeof MOOD_EMOJIS]}
                        </span>
                        {dayLog.note && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Log Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-bold mb-1">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {isToday(selectedDate) ? "How are you feeling today?" : "How did you feel on this day?"}
            </p>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Mood</label>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRating(val)}
                      className={clsx(
                        "flex flex-col items-center gap-1 p-2 rounded-xl flex-1 transition-all",
                        rating === val ? "bg-primary/10 ring-2 ring-primary scale-105" : "hover:bg-muted opacity-60 hover:opacity-100 grayscale hover:grayscale-0",
                        rating === val && "opacity-100 grayscale-0"
                      )}
                    >
                      <span className="text-3xl">{MOOD_EMOJIS[val as keyof typeof MOOD_EMOJIS]}</span>
                      <span className="text-[10px] font-medium hidden sm:block">{MOOD_LABELS[val as keyof typeof MOOD_LABELS]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What made you feel this way?"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[120px] resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!rating || isSubmitting}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Save Log
                </button>
                {currentLog && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="p-2 border border-border text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50"
                    title="Delete this log"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
