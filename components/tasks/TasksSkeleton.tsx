import { Skeleton } from "@/components/ui/skeleton";

export function TasksSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Skeleton className="h-5 w-5 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      ))}
    </div>
  );
}
