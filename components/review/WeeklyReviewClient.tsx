"use client";

import { useEffect, useState } from "react";
import { format, parseISO, subWeeks, addWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { calculateWeeklyMetrics, getWeeklyReview, saveWeeklyReview, WeeklyMetrics, WeeklyReview } from "@/actions/weekly-review";
import { useRouter } from "next/navigation";
import { useReviewStore } from "@/store/useReviewStore";

interface WeeklyReviewClientProps {
  startDate: string;
  endDate: string;
}

const STATIC_QUESTIONS = [
  { id: "went_well", label: "What went well this week?" },
  { id: "to_improve", label: "What could be improved?" },
  { id: "next_week", label: "What are your top priorities for next week?" }
];

const MOOD_EMOJIS = {
  1: "😄",
  2: "🙂",
  3: "😐",
  4: "🙁",
  5: "😞",
};

export function WeeklyReviewClient({ startDate, endDate }: WeeklyReviewClientProps) {
  const router = useRouter();
  
  const { reviews, metrics, reflections, setReviewData } = useReviewStore();
  
  // If we have it in the store, we don't need to show a loading skeleton initially.
  const hasCachedData = !!metrics[startDate];
  const [loading, setLoading] = useState(!hasCachedData);
  
  const [localReflection, setLocalReflection] = useState<Record<string, string>>(
    reflections[startDate] || { went_well: "", to_improve: "", next_week: "" }
  );
  const [isSaving, setIsSaving] = useState(false);

  // Sync local reflection state when store updates
  useEffect(() => {
    if (reflections[startDate]) {
      setLocalReflection(reflections[startDate]);
    }
  }, [reflections, startDate]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      // If no cache, show loading
      if (!metrics[startDate]) setLoading(true);
      
      const { data: existingReview } = await getWeeklyReview(startDate, endDate);
      
      if (isMounted) {
        if (existingReview) {
          setReviewData(
            startDate, 
            existingReview, 
            existingReview.metrics as any, 
            (existingReview.reflection as Record<string, string>) || { went_well: "", to_improve: "", next_week: "" }
          );
        } else {
          const { data: freshMetrics } = await calculateWeeklyMetrics(startDate, endDate);
          if (freshMetrics) {
            setReviewData(startDate, null, freshMetrics, { went_well: "", to_improve: "", next_week: "" });
          }
        }
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [startDate, endDate, setReviewData]);

  const currentMetrics = metrics[startDate];
  const currentReview = reviews[startDate];

  const handleSave = async () => {
    if (!currentMetrics) return;
    setIsSaving(true);
    
    const { data } = await saveWeeklyReview(startDate, endDate, currentMetrics, localReflection);
    if (data) {
      setReviewData(startDate, data, currentMetrics, localReflection);
    }
    
    setIsSaving(false);
  };

  const navigateWeek = (dir: -1 | 1) => {
    const d = parseISO(startDate);
    const target = dir === -1 ? subWeeks(d, 1) : addWeeks(d, 1);
    router.push(`/review?week=${format(target, "yyyy-MM-dd")}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* Header / Nav */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {format(parseISO(startDate), "MMM d")} - {format(parseISO(endDate), "MMM d, yyyy")}
        </h2>
        <div className="flex gap-2">
          <button onClick={() => navigateWeek(-1)} className="p-2 hover:bg-muted rounded-md transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => navigateWeek(1)} className="p-2 hover:bg-muted rounded-md transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard 
            label="Tasks Done" 
            value={currentMetrics?.tasksCompleted?.toString() || "0"} 
            loading={loading} 
          />
          <MetricCard 
            label="Habit Check-ins" 
            value={currentMetrics?.habitCheckins?.toString() || "0"} 
            loading={loading} 
          />
          <MetricCard 
            label="Net Savings" 
            value={`$${currentMetrics?.netSavings?.toFixed(2) || "0.00"}`} 
            valueColor={currentMetrics?.netSavings && currentMetrics.netSavings >= 0 ? "text-green-500" : "text-red-500"}
            loading={loading} 
          />
          <MetricCard 
            label="Focus Time" 
            value={`${currentMetrics?.focusMinutes || 0}m`} 
            loading={loading} 
          />
          <MetricCard 
            label="Avg Mood" 
            value={currentMetrics?.averageMood ? MOOD_EMOJIS[Math.round(currentMetrics.averageMood) as keyof typeof MOOD_EMOJIS] : "-"} 
            loading={loading} 
          />
        </div>

        {/* Reflection Form */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Reflection</h3>
            {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
          </div>
          
          <div className="space-y-6">
            {STATIC_QUESTIONS.map(q => (
              <div key={q.id} className="space-y-2">
                <label className="text-sm font-medium">{q.label}</label>
                <textarea
                  value={localReflection[q.id] || ""}
                  onChange={(e) => setLocalReflection(prev => ({ ...prev, [q.id]: e.target.value }))}
                  disabled={loading}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-y disabled:opacity-50"
                  placeholder={loading ? "Loading..." : "Write your thoughts..."}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading || isSaving}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {currentReview ? "Update Review" : "Save Review"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, valueColor = "text-foreground", loading = false }: { label: string, value: string, valueColor?: string, loading?: boolean }) {
  return (
    <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center h-[94px]">
      <p className="text-sm text-muted-foreground mb-1 font-medium">{label}</p>
      {loading ? (
        <div className="h-8 w-12 bg-muted rounded animate-pulse mt-1"></div>
      ) : (
        <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      )}
    </div>
  );
}
