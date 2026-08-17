"use client";

import { useEffect, useState } from "react";
import { useUtilityTimerStore } from "@/store/useUtilityTimerStore";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10); // 2 digits for ms
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  
  const formattedMs = milliseconds.toString().padStart(2, "0");
  
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${formattedMs}`;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${formattedMs}`;
}

export function UtilityTimers() {
  const { 
    timers, stopwatch, 
    startStopwatch, pauseStopwatch, resetStopwatch, tickStopwatch,
    addTimer, removeTimer, startTimer, pauseTimer, resetTimer, tickTimers 
  } = useUtilityTimerStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newMins, setNewMins] = useState("");

  useEffect(() => {
    // eslint-disable-next-line
    setIsHydrated(true);
    const interval = setInterval(() => {
      tickStopwatch();
      tickTimers();
    }, 16); // roughly 60fps for smooth ms rendering
    return () => clearInterval(interval);
  }, [tickStopwatch, tickTimers]);

  if (!isHydrated) return null;

  const handleAddTimer = () => {
    const mins = parseInt(newMins);
    if (newLabel.trim() && !isNaN(mins) && mins > 0) {
      addTimer(newLabel.trim(), mins * 60 * 1000);
      setNewLabel("");
      setNewMins("");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 delay-150 fill-mode-both">
      {/* Stopwatch Section */}
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">Stopwatch</h3>
        <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-5xl font-mono font-bold tracking-tight tabular-nums">
            {formatTime(stopwatch.elapsedMs)}
          </div>
          <div className="flex gap-3">
            {stopwatch.isRunning ? (
              <Button onClick={pauseStopwatch} variant="secondary" size="lg" className="w-24 gap-2">
                <Pause className="h-4 w-4" /> Pause
              </Button>
            ) : (
              <Button onClick={startStopwatch} size="lg" className="w-24 gap-2">
                <Play className="h-4 w-4" /> Start
              </Button>
            )}
            <Button onClick={resetStopwatch} variant="outline" size="lg" className="w-24 gap-2">
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Generic Timers Section */}
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">Timers</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {timers.map((timer) => (
            <div key={timer.id} className="relative group bg-card border rounded-xl p-5 shadow-sm">
              <button 
                onClick={() => removeTimer(timer.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-md"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex flex-col h-full">
                <div className="text-sm font-medium text-muted-foreground pr-6 truncate">
                  {timer.label}
                </div>
                <div className={cn(
                  "text-4xl font-mono font-bold tracking-tight tabular-nums mt-2 mb-4",
                  timer.remainingMs === 0 && !timer.isRunning && timer.durationMs > 0 ? "text-destructive animate-pulse" : ""
                )}>
                  {formatTime(timer.remainingMs)}
                </div>
                
                <div className="flex items-center gap-2 mt-auto">
                  {timer.isRunning ? (
                    <Button onClick={() => pauseTimer(timer.id)} variant="secondary" size="sm" className="flex-1 gap-2">
                      <Pause className="h-3 w-3" /> Pause
                    </Button>
                  ) : (
                    <Button onClick={() => startTimer(timer.id)} size="sm" className="flex-1 gap-2">
                      <Play className="h-3 w-3" /> Start
                    </Button>
                  )}
                  <Button onClick={() => resetTimer(timer.id)} variant="outline" size="sm" className="px-3">
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Timer Form */}
        <div className="flex items-center gap-3 bg-muted/40 border rounded-lg p-3 max-w-xl">
          <input 
            type="text" 
            placeholder="Timer Label (e.g. Break)" 
            className="flex-1 bg-background border rounded-md px-3 py-2 text-sm"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Minutes" 
            className="w-24 bg-background border rounded-md px-3 py-2 text-sm"
            value={newMins}
            onChange={(e) => setNewMins(e.target.value)}
            min="1"
          />
          <Button onClick={handleAddTimer} variant="secondary" className="gap-2">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}
