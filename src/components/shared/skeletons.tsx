import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-3.5", index === lines - 1 ? "w-2/3" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}>
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex items-center justify-between border-t border-border pt-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 6,
  columns = "lg:grid-cols-3",
  className,
}: {
  count?: number;
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-6 sm:grid-cols-2", columns, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function SkeletonStatStrip({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-3 bg-card p-5">
          <Skeleton className="h-2.5 w-16" />
          <Skeleton className="h-8 w-14" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center gap-4 border-b border-border px-4 py-3.5">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="ml-auto h-2.5 w-16" />
        <Skeleton className="h-2.5 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-border/70 px-4 py-4 last:border-0">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-2.5 w-1/4" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
      <div>
        <Skeleton className="aspect-4/3 w-full rounded-lg" />
        <div className="mt-5 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="aspect-4/3 rounded-md" />
          ))}
        </div>
        <div className="mt-9 space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
          <SkeletonText lines={4} className="pt-4" />
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}
