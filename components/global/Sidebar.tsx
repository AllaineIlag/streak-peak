"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CheckSquare, Flame, Timer, Calendar, BookOpen, Settings, Clock, Wallet, Smile, LineChart } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Finance", href: "/finance", icon: Wallet },
    { name: "Mood", href: "/mood", icon: Smile },
    { name: "Review", href: "/review", icon: LineChart },
    { name: "Habits", href: "/habits", icon: Flame },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Pomodoro", href: "/pomodoro", icon: Timer },
    { name: "Clocks", href: "/clocks", icon: Clock },
    { name: "Notes", href: "/notes", icon: BookOpen },
    { name: "Settings", href: "/profile", icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r h-[calc(100vh-3.5rem)] bg-background">
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary hover:bg-muted",
                  isActive ? "bg-muted text-primary font-semibold" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
