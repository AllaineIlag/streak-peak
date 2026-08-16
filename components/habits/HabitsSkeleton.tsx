import { Skeleton } from "@/components/ui/skeleton";

export function HabitsSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 7 }).map((_, j) => (
                <div key={j} className="flex flex-col items-center gap-1">
                  <Skeleton className="h-3 w-4" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </div>
            <Skeleton className="h-8 w-8 rounded-md hidden md:block" />
          </div>
        </div>
      ))}
    </div>
  );
}
