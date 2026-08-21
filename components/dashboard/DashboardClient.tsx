"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format } from "date-fns";
import { GripHorizontal } from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
  data: any;
}

const WIDGETS = [
  { id: "tasks", title: "Today's Tasks", link: "/tasks" },
  { id: "habits", title: "Today's Habits", link: "/habits" },
  { id: "finance", title: "Finance Summary", link: "/finance" },
  { id: "mood", title: "Today's Mood", link: "/mood" },
  { id: "calendar", title: "Agenda", link: "/calendar" },
  { id: "pomodoro", title: "Quick Timer", link: "/pomodoro" },
];

export function DashboardClient({ data }: DashboardClientProps) {
  const [items, setItems] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard_order");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === WIDGETS.length) {
            return parsed;
          }
        } catch (e) {}
      }
    }
    return WIDGETS.map(w => w.id);
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newItems = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem("dashboard_order", JSON.stringify(newItems));
        return newItems;
      });
    }
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SortableContext items={items} strategy={rectSortingStrategy}>
          {items.map((id) => {
            const widget = WIDGETS.find((w) => w.id === id);
            if (!widget) return null;
            return <SortableWidget key={id} id={id} widget={widget} data={data} />;
          })}
        </SortableContext>
      </div>
    </DndContext>
  );
}

function SortableWidget({ id, widget, data }: { id: string, widget: typeof WIDGETS[0], data: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col h-[300px] ${isDragging ? "opacity-50 ring-2 ring-primary" : ""}`}
    >
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
        <Link href={widget.link} className="font-bold hover:underline">{widget.title}</Link>
        <button {...attributes} {...listeners} className="p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing">
          <GripHorizontal className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <WidgetContent id={id} data={data} />
      </div>
    </div>
  );
}

function WidgetContent({ id, data }: { id: string, data: any }) {
  if (id === "tasks") {
    const tasks = data.tasks;
    if (tasks.length === 0) return <p className="text-sm text-muted-foreground">No tasks for today.</p>;
    return (
      <ul className="space-y-2">
        {tasks.slice(0, 5).map((t: any) => (
          <li key={t.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={t.status === "done"} readOnly className="w-4 h-4 rounded-full" />
            <span className={t.status === "done" ? "line-through text-muted-foreground" : ""}>{t.title}</span>
          </li>
        ))}
        {tasks.length > 5 && <li className="text-xs text-muted-foreground pt-2">+{tasks.length - 5} more</li>}
      </ul>
    );
  }

  if (id === "habits") {
    const habits = data.habits;
    const checkins = data.habitCheckins;
    if (habits.length === 0) return <p className="text-sm text-muted-foreground">No habits tracked.</p>;
    return (
      <ul className="space-y-3">
        {habits.slice(0, 4).map((h: any) => {
          const checked = checkins.some((c: any) => c.habit_id === h.id);
          return (
            <li key={h.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="text-lg">{h.icon}</span>
                {h.name}
              </span>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${checked ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                {checked && <div className="w-2.5 h-2.5 bg-current rounded-full" />}
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  if (id === "finance") {
    const transactions = data.financeTransactions;
    const income = transactions.filter((t: any) => t.type === "income").reduce((a: any, b: any) => a + b.amount, 0);
    const expense = transactions.filter((t: any) => t.type === "expense").reduce((a: any, b: any) => a + b.amount, 0);
    return (
      <div className="flex flex-col h-full justify-center space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Income</span>
          <span className="font-medium text-green-500">${income.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Expenses</span>
          <span className="font-medium text-red-500">${expense.toFixed(2)}</span>
        </div>
        <div className="w-full h-px bg-border my-2" />
        <div className="flex justify-between items-center font-bold">
          <span>Net</span>
          <span className={income - expense >= 0 ? "text-green-500" : "text-red-500"}>${(income - expense).toFixed(2)}</span>
        </div>
      </div>
    );
  }

  if (id === "mood") {
    const mood = data.mood;
    if (!mood) return <div className="flex flex-col items-center justify-center h-full text-center space-y-2"><p className="text-sm text-muted-foreground">How are you feeling?</p><Link href="/mood" className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-md font-medium hover:bg-primary/20">Log Mood</Link></div>;
    const EMOJIS: any = { 1: "😄", 2: "🙂", 3: "😐", 4: "🙁", 5: "😞" };
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-6xl mb-4">{EMOJIS[mood.rating]}</span>
        {mood.note && <p className="text-sm text-center text-muted-foreground italic">"{mood.note}"</p>}
      </div>
    );
  }

  if (id === "calendar") {
    const events = data.events;
    if (events.length === 0) return <p className="text-sm text-muted-foreground">No events today.</p>;
    return (
      <ul className="space-y-3">
        {events.slice(0, 4).map((e: any) => {
          const start = new Date(e.start_time);
          const end = new Date(e.end_time);
          return (
            <li key={e.id} className="text-sm border-l-2 pl-3 py-1 flex flex-col" style={{ borderColor: e.color }}>
              <span className="font-medium truncate">{e.title}</span>
              <span className="text-xs text-muted-foreground">{format(start, "h:mm a")} - {format(end, "h:mm a")}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  if (id === "pomodoro") {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
        <div className="text-4xl font-bold font-mono tracking-wider">25:00</div>
        <Link href="/pomodoro" className="bg-primary text-primary-foreground px-6 py-2 rounded-full text-sm font-bold hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95 shadow-md">
          Start Focus
        </Link>
      </div>
    );
  }

  return null;
}
