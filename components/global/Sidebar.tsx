import Link from "next/link";
import { Home, CheckSquare, Calendar, Clock, BookOpen, Settings, Flame } from "lucide-react";

export function Sidebar() {
  const navItems = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Habits", href: "/habits", icon: Flame },
    { name: "Calendar", href: "/calendar", icon: Calendar },
    { name: "Focus", href: "/pomodoro", icon: Clock },
    { name: "Notes", href: "/notes", icon: BookOpen },
    { name: "Settings", href: "/profile", icon: Settings },
  ];

  return (
    <div className="hidden md:flex flex-col w-64 border-r h-[calc(100vh-3.5rem)] bg-background">
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
