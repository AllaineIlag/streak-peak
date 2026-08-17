"use client";

import { useTimerStore, TimerPreset } from "@/store/useTimerStore";
import { Play, Pause, RotateCcw, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { logFocusSession } from "@/actions/focus";

interface TimerCardProps {
  preset: TimerPreset;
}

export function TimerCard({ preset }: TimerCardProps) {
  const {
    activePresetId,
    phase,
    status,
    timeRemaining,
    endTime,
    currentRound,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    tick,
    completePhase,
    deletePreset,
    updatePreset
  } = useTimerStore();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(preset.name);
  const [editRounds, setEditRounds] = useState(preset.rounds.toString());
  const [editBaseFocus, setEditBaseFocus] = useState(preset.baseFocus.toString());
  const [editFocusChange, setEditFocusChange] = useState(preset.focusChange.toString());
  const [editBaseBreak, setEditBaseBreak] = useState(preset.baseBreak.toString());
  const [editBreakChange, setEditBreakChange] = useState(preset.breakChange.toString());

  const handleUpdate = () => {
    if (!editName.trim()) return;
    updatePreset(preset.id, {
      name: editName,
      rounds: parseInt(editRounds) || 4,
      baseFocus: parseInt(editBaseFocus) || 25,
      focusChange: parseInt(editFocusChange) || 0,
      baseBreak: parseInt(editBaseBreak) || 5,
      breakChange: parseInt(editBreakChange) || 0,
    });
    setIsEditOpen(false);
  };

  const isActive = activePresetId === preset.id;
  
  // Calculate Max Time for the ring
  let maxTime = (preset.baseFocus || 25) * 60;
  if (isActive) {
    if (phase === "focus") {
      const focusMins = (preset.baseFocus || 25) + (currentRound - 1) * (preset.focusChange || 0);
      maxTime = Math.max(1, focusMins) * 60;
    } else {
      const breakMins = (preset.baseBreak || 5) + (currentRound - 1) * (preset.breakChange || 0);
      maxTime = Math.max(1, breakMins) * 60;
    }
  }

  // Calculate display time
  const displayTime = isActive ? (timeRemaining || 0) : maxTime;

  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    if (!isActive || status !== "running" || !endTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.round((endTime - now) / 1000));
      
      if (remaining > 0) {
        tick(remaining);
      } else {
        tick(0);
        handlePhaseComplete();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, status, endTime, phase, currentRound]);

  const handlePhaseComplete = async () => {
    if (phase === "focus") {
      setIsLogging(true);
      try {
        const focusMins = (preset.baseFocus || 25) + (currentRound - 1) * (preset.focusChange || 0);
        const startedAt = new Date(Date.now() - focusMins * 60 * 1000).toISOString();
        const endedAt = new Date().toISOString();
        await logFocusSession(Math.max(1, focusMins), startedAt, endedAt);
      } catch (err) {
        console.error("Failed to log session:", err);
      } finally {
        setIsLogging(false);
      }
    }
    completePhase();
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progress = maxTime > 0 ? (displayTime / maxTime) * 100 : 0;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  // Fallback to prevent NaN error in the DOM
  const safeProgress = Number.isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (safeProgress / 100) * circumference;

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-between p-6 rounded-3xl border shadow-sm transition-all animate-in zoom-in-95 duration-500",
      isActive && status === "running" ? "border-primary/50 bg-primary/5 shadow-md" : "bg-card hover:border-foreground/20"
    )}>
      
      <div className="w-full flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{preset.name}</h3>
          {isActive ? (
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {phase === "focus" ? `Focus (Round ${currentRound}/${preset.rounds})` : `Break (Round ${currentRound}/${preset.rounds})`}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground font-medium">
              {preset.rounds} rounds
            </p>
          )}
        </div>
        
        {!isActive && preset.id !== "default" && preset.id !== "incremental-break" && preset.id !== "decremental-focus" && (
          <div className="flex items-center gap-1">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" />}>
                <Edit className="h-4 w-4" />
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit Timer</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preset Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Rounds (Sessions)</label>
                    <Input type="number" min="1" max="20" value={editRounds} onChange={(e) => setEditRounds(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Focus Time (mins)</label>
                      <Input type="number" min="1" max="120" value={editBaseFocus} onChange={(e) => setEditBaseFocus(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Focus Change/Round</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={parseInt(editFocusChange) < 0 ? "default" : "outline"}
                          onClick={() => setEditFocusChange("-" + Math.abs(parseInt(editFocusChange) || 0))}
                          className="px-2"
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          min="0" 
                          max="60" 
                          value={Math.abs(parseInt(editFocusChange) || 0)} 
                          onChange={(e) => setEditFocusChange(parseInt(editFocusChange) < 0 ? "-" + e.target.value : e.target.value)} 
                        />
                        <Button 
                          type="button"
                          variant={parseInt(editFocusChange) > 0 ? "default" : "outline"}
                          onClick={() => setEditFocusChange(Math.abs(parseInt(editFocusChange) || 0).toString())}
                          className="px-2"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Break Time (mins)</label>
                      <Input type="number" min="1" max="60" value={editBaseBreak} onChange={(e) => setEditBaseBreak(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Break Change/Round</label>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant={parseInt(editBreakChange) < 0 ? "default" : "outline"}
                          onClick={() => setEditBreakChange("-" + Math.abs(parseInt(editBreakChange) || 0))}
                          className="px-2"
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          min="0" 
                          max="30" 
                          value={Math.abs(parseInt(editBreakChange) || 0)} 
                          onChange={(e) => setEditBreakChange(parseInt(editBreakChange) < 0 ? "-" + e.target.value : e.target.value)} 
                        />
                        <Button 
                          type="button"
                          variant={parseInt(editBreakChange) > 0 ? "default" : "outline"}
                          onClick={() => setEditBreakChange(Math.abs(parseInt(editBreakChange) || 0).toString())}
                          className="px-2"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpdate} disabled={!editName.trim()}>Save Changes</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deletePreset(preset.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="relative flex items-center justify-center mb-8 mt-4">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-muted/30"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-300 ease-linear",
              !isActive ? "text-muted-foreground/30" : phase === "focus" ? "text-primary" : "text-emerald-500"
            )}
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className={cn("text-4xl font-bold tracking-tighter tabular-nums", !isActive && "text-muted-foreground")}>
            {formatTime(displayTime)}
          </span>
          {isLogging && <span className="text-[10px] text-muted-foreground mt-1 absolute -bottom-5">Saving...</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full justify-center">
        {isActive ? (
          <>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={resetTimer}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="default"
              className={cn(
                "rounded-full px-8 transition-all",
                status === "running" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : ""
              )}
              onClick={() => status === "running" ? pauseTimer(timeRemaining) : resumeTimer()}
            >
              {status === "running" ? (
                <><Pause className="mr-2 h-4 w-4" /> Pause</>
              ) : (
                <><Play className="mr-2 h-4 w-4" /> Resume</>
              )}
            </Button>
          </>
        ) : (
          <Button
            size="default"
            variant="default"
            className="rounded-full px-8 w-full max-w-[200px]"
            onClick={() => startTimer(preset.id)}
          >
            <Play className="mr-2 h-4 w-4" /> Start
          </Button>
        )}
      </div>
    </div>
  );
}
