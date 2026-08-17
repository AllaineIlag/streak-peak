"use client";

import { useState, useMemo } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Settings2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { EventDialog } from "./EventDialog";
import { cn } from "@/lib/utils";

export function CalendarTimeline() {
  const { events, focusSessions, isHydrated } = useEventStore();
  
  // Settings state
  const [pixelsPerHour, setPixelsPerHour] = useState(80);
  const [showFocusSessions, setShowFocusSessions] = useState(true);
  
  // Date state
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogInitialStart, setDialogInitialStart] = useState<Date | null>(null);

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setCurrentDate(d);
  };

  // Filter events for the current date
  const todaysEvents = useMemo(() => {
    return events.filter(e => {
      const start = new Date(e.start_time);
      const end = new Date(e.end_time);
      // Event touches today if start is before end of today AND end is after start of today
      const startOfToday = new Date(currentDate);
      const endOfToday = new Date(currentDate);
      endOfToday.setDate(endOfToday.getDate() + 1);
      
      return start < endOfToday && end > startOfToday;
    });
  }, [events, currentDate]);

  const todaysFocusSessions = useMemo(() => {
    return focusSessions.filter(fs => {
      const start = new Date(fs.started_at);
      const startOfToday = new Date(currentDate);
      const endOfToday = new Date(currentDate);
      endOfToday.setDate(endOfToday.getDate() + 1);
      return start >= startOfToday && start < endOfToday;
    });
  }, [focusSessions, currentDate]);

  const getEventStyle = (startTimeStr: string, endTimeStr: string) => {
    const start = new Date(startTimeStr);
    const end = new Date(endTimeStr);
    
    // Clamp to current day bounds for visual rendering
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const renderStart = start < dayStart ? dayStart : start;
    const renderEnd = end > dayEnd ? dayEnd : end;

    const startMinutes = renderStart.getHours() * 60 + renderStart.getMinutes();
    const endMinutes = renderEnd.getHours() * 60 + renderEnd.getMinutes();
    const durationMinutes = Math.max(0, endMinutes - startMinutes);

    return {
      top: `${(startMinutes / 60) * pixelsPerHour}px`,
      height: `${(durationMinutes / 60) * pixelsPerHour}px`,
    };
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only open dialog if clicking the grid directly, not an event
    if (e.target !== e.currentTarget) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hours = y / pixelsPerHour;
    
    const startHour = Math.floor(hours);
    const startMinute = pixelsPerHour === 80 
      ? (hours - startHour >= 0.5 ? 30 : 0) // if 80px (1hr view), snap to 30 mins
      : (hours - startHour >= 0.5 ? 30 : 0); // snap to 30 mins always for simplicity

    const newStart = new Date(currentDate);
    newStart.setHours(startHour, startMinute, 0, 0);
    
    setSelectedEventId(null);
    setDialogInitialStart(newStart);
    setIsDialogOpen(true);
  };

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-md border shadow-sm overflow-hidden">
            <Button variant="ghost" size="icon" onClick={handlePrevDay} className="rounded-none border-r h-9">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" onClick={handleToday} className="rounded-none h-9 px-4 font-medium">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextDay} className="rounded-none border-l h-9">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-semibold min-w-[200px]">
            {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2")}>
            <Settings2 className="h-4 w-4" />
            View Options
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => setPixelsPerHour(80)}>
              <span className={cn("flex-1", pixelsPerHour === 80 && "font-bold")}>1-Hour Grid</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPixelsPerHour(160)}>
              <span className={cn("flex-1", pixelsPerHour === 160 && "font-bold")}>30-Minute Grid</span>
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem checked={showFocusSessions} onCheckedChange={setShowFocusSessions}>
              Show Focus Sessions
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Timeline Scroll Area */}
      <div className="flex-1 overflow-y-auto relative bg-muted/10">
        <div className="flex min-w-[800px] pt-4 pb-8">
          {/* Time Labels Sidebar */}
          <div className="w-20 flex-shrink-0 border-r bg-background relative z-10">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="relative pr-4 text-right text-sm text-muted-foreground font-medium"
                style={{ height: `${pixelsPerHour}px` }}
              >
                <span className="absolute -top-3 right-4 bg-background px-1">
                  {i === 0 ? "12 AM" : i < 12 ? `${i} AM` : i === 12 ? "12 PM" : `${i - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Grid and Events */}
          <div 
            className="flex-1 relative cursor-crosshair"
            onClick={handleGridClick}
            style={{ height: `${24 * pixelsPerHour}px` }}
          >
            {/* Grid Lines */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-full border-t border-border/50 pointer-events-none"
                style={{ top: `${i * pixelsPerHour}px` }}
              >
                {pixelsPerHour >= 160 && (
                  <div className="absolute w-full border-t border-border/25 border-dashed" style={{ top: `${pixelsPerHour / 2}px` }} />
                )}
              </div>
            ))}

            {/* Events */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pl-4 pr-6 pt-0">
              {todaysEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEventId(event.id);
                    setDialogInitialStart(null);
                    setIsDialogOpen(true);
                  }}
                  className="absolute left-4 right-[160px] bg-primary/10 border border-primary/20 text-primary rounded-md p-2 overflow-hidden cursor-pointer hover:bg-primary/15 hover:border-primary/30 transition-colors z-10 shadow-sm"
                  style={getEventStyle(event.start_time, event.end_time)}
                >
                  <h4 className="font-semibold text-sm truncate leading-tight">{event.title}</h4>
                </div>
              ))}

              {/* Focus Sessions (Read Only) */}
              {showFocusSessions && todaysFocusSessions.map((fs) => (
                <div
                  key={fs.id}
                  className="absolute right-6 w-[140px] bg-orange-500/10 border border-orange-500/20 text-orange-600 rounded-md p-2 overflow-hidden pointer-events-none flex flex-col z-0"
                  style={getEventStyle(fs.started_at, fs.ended_at || new Date(new Date(fs.started_at).getTime() + fs.duration_minutes * 60000).toISOString())}
                >
                  <h4 className="font-semibold text-xs flex items-center gap-1.5 truncate"><span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" /> Focus Session</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <EventDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        eventId={selectedEventId} 
        initialStart={dialogInitialStart} 
      />
    </div>
  );
}
