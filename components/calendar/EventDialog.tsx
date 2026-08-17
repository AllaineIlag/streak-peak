"use client";

import { useEffect, useState, useTransition } from "react";
import { useEventStore } from "@/store/useEventStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { createEvent, updateEvent, deleteEvent } from "@/actions/events";

interface EventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string | null;
  initialStart: Date | null;
}

export function EventDialog({ isOpen, onOpenChange, eventId, initialStart }: EventDialogProps) {
  const { events, addEvent, updateEvent: updateEventOptimistic, deleteEvent: deleteEventOptimistic } = useEventStore();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (eventId) {
        const event = events.find(e => e.id === eventId);
        if (event) {
          setTitle(event.title);
          setDescription(event.description || "");
          
          // Format times for datetime-local input
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);
          setStartTime(formatForInput(start));
          setEndTime(formatForInput(end));
        }
      } else if (initialStart) {
        setTitle("");
        setDescription("");
        const end = new Date(initialStart);
        end.setHours(end.getHours() + 1);
        
        setStartTime(formatForInput(initialStart));
        setEndTime(formatForInput(end));
      }
    }
  }, [isOpen, eventId, initialStart, events]);

  const formatForInput = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const handleSave = () => {
    if (!title.trim() || !startTime || !endTime) return;
    
    // Ensure correct JS Dates before saving (adjusting back from local input string)
    const startIso = new Date(startTime).toISOString();
    const endIso = new Date(endTime).toISOString();

    if (eventId) {
      // Edit
      const eventToUpdate = events.find(e => e.id === eventId);
      if (!eventToUpdate) return;

      const previousState = { ...eventToUpdate };
      
      // Optimistic
      updateEventOptimistic(eventId, { title, description, start_time: startIso, end_time: endIso });
      onOpenChange(false);

      startTransition(async () => {
        try {
          await updateEvent(eventId, { title, description, start_time: startIso, end_time: endIso });
        } catch (err) {
          updateEventOptimistic(eventId, previousState);
          console.error("Failed to update event", err);
        }
      });
    } else {
      // Create
      const tempId = crypto.randomUUID();
      
      // Optimistic
      addEvent({
        id: tempId,
        title,
        description,
        start_time: startIso,
        end_time: endIso,
        created_at: new Date().toISOString(),
        user_id: "temp",
      });
      onOpenChange(false);

      startTransition(async () => {
        try {
          const created = await createEvent({ title, description, start_time: startIso, end_time: endIso });
          if (created) {
            deleteEventOptimistic(tempId);
            addEvent(created);
          }
        } catch (err) {
          deleteEventOptimistic(tempId);
          console.error("Failed to create event", err);
        }
      });
    }
  };

  const handleDelete = () => {
    if (!eventId) return;
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    const eventToDelete = events.find(e => e.id === eventId);
    if (!eventToDelete) return;

    // Optimistic
    deleteEventOptimistic(eventId);
    onOpenChange(false);

    startTransition(async () => {
      try {
        await deleteEvent(eventId);
      } catch (err) {
        addEvent(eventToDelete);
        console.error("Failed to delete event", err);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{eventId ? "Edit Event" : "New Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Meeting with Team"
              autoFocus
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input 
                type="datetime-local" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time</label>
              <Input 
                type="datetime-local" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Add details, links, or notes..."
              className="resize-none h-20"
            />
          </div>
        </div>
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          {eventId ? (
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <div />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={!title.trim() || !startTime || !endTime || isPending}>
              Save Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
