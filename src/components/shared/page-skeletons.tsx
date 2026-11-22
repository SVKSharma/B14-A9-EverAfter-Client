import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * Route-level skeletons.
 *
 * Every export mirrors the real page's container, grid and element order so the
 * swap from placeholder to content does not shift anything. Bars use the same
 * heights as the text they stand in for; blocks use the same aspect ratios.
 */

function Bar({ className }: { className?: string }) {
  return <Skeleton className={cn("h-3 rounded-sm", className)} />;
}

function Panel({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

function Pill({ className }: { className?: string }) {
  return <Skeleton className={cn("h-6 rounded-full", className)} />;
}

/* ------------------------------------------------------------------ chrome */

export function PageHeaderSkeleton({
  breadcrumb = true,
  description = true,
  actions = false,
}: {
  breadcrumb?: boolean;
  description?: boolean;
  actions?: boolean;
}) {
  return (
    <div className="border-b border-border pb-7">
      {breadcrumb ? (
        <div className="mb-5 flex items-center gap-2">
          <Bar className="h-2.5 w-24" />
          <span className="h-2.5 w-1.5 rounded-sm bg-muted" aria-hidden="true" />
          <Bar className="h-2.5 w-16" />
        </div>
      ) : null}

      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full min-w-0">
          <Bar className="h-2.5 w-20" />
          <Skeleton className="mt-4 h-9 w-full max-w-sm" />
          {description ? (
            <div className="mt-4 space-y-2.5">
              <Bar className="h-3.5 w-full max-w-xl" />
              <Bar className="h-3.5 w-2/3 max-w-md" />
            </div>
          ) : null}
        </div>
        {actions ? <Skeleton className="h-11 w-36 shrink-0 rounded-full" /> : null}
      </div>
    </div>
  );
}

export function StatStripSkeleton({
  count = 4,
  columns = "xl:grid-cols-4",
  className,
}: {
  count?: number;
  columns?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2",
        columns,
        className
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-card p-5">
          <div className="flex items-center justify-between gap-3">
            <Bar className="h-2.5 w-20" />
            <Skeleton className="size-3.5 rounded-full" />
          </div>
          <Skeleton className="mt-4 h-8 w-14" />
          <Bar className="mt-3 h-2.5 w-28" />
        </div>
      ))}
    </div>
  );
}

export function FilterChipsSkeleton({
  count = 5,
  size = "default",
}: {
  count?: number;
  size?: "default" | "sm";
}) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            "shrink-0 rounded-full",
            size === "sm" ? "h-6 w-20" : "h-8 w-24"
          )}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------- home */

export function HomeSkeleton() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20 xl:gap-24">
          <div className="max-w-xl">
            <Skeleton className="h-7 w-48 rounded-full" />

            <div className="mt-8 space-y-3">
              <Skeleton className="h-11 w-full max-w-md" />
              <Skeleton className="h-11 w-4/5 max-w-md" />
            </div>

            <div className="mt-8 space-y-2.5">
              <Bar className="h-3.5 w-full max-w-lg" />
              <Bar className="h-3.5 w-4/5 max-w-md" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Skeleton className="h-12 w-60 rounded-full" />
              <Bar className="h-3 w-24" />
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-5 border-t border-border/70 pt-7">
              <Skeleton className="h-3 w-20" />
              <Bar className="h-3 w-40" />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <Skeleton className="aspect-4/5 w-full rounded-3xl" />
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 w-full max-w-7xl px-5 sm:px-7 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/40 bg-border/40 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-card/70 px-4 py-6 text-center sm:px-6">
              <Skeleton className="mx-auto h-7 w-16" />
              <Skeleton className="mx-auto mt-3 h-2.5 w-20" />
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border/70">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <Bar className="h-2.5 w-24" />
              <Skeleton className="mt-4 h-10 w-full max-w-sm" />
              <div className="mt-4 space-y-2.5">
                <Bar className="h-3.5 w-full max-w-lg" />
                <Bar className="h-3.5 w-2/3 max-w-md" />
              </div>
            </div>
            <Bar className="h-3 w-24" />
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56 w-full rounded-2xl sm:h-64" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function FeaturedServicesSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10",
        className
      )}
    >
      <div className="min-w-0">
        <ServiceCardSkeleton />
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-3 sm:gap-4"
          >
            <Skeleton className="size-16 shrink-0 rounded-xl sm:size-24" />
            <div className="min-w-0 flex-1 space-y-2.5">
              <Bar className="h-2.5 w-24" />
              <Skeleton className="h-4 w-3/4" />
              <Bar className="h-2.5 w-1/2" />
            </div>
            <div className="shrink-0 space-y-2 text-right">
              <Skeleton className="ml-auto h-4 w-16" />
              <Bar className="ml-auto h-3 w-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ service grid */

/** Mirrors `ServiceCard`: inset photo, title, vendor, location, price row. */
export function ServiceCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-card/80 backdrop-blur-xl",
        className
      )}
    >
      <div className="m-2">
        <Skeleton className="aspect-4/5 w-full rounded-xl" />
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <Skeleton className="h-6 w-3/4" />
        <Bar className="mt-2.5 h-3 w-1/2" />
        <Bar className="mt-3.5 h-3 w-2/5" />
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <div className="space-y-2">
            <Bar className="h-2.5 w-10" />
            <Skeleton className="h-5 w-20" />
          </div>
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function ServiceCardGridSkeleton({
  count = 6,
  columns = "lg:grid-cols-3",
  className,
}: {
  count?: number;
  columns?: string;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", columns, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- browse */

export function BrowseServicesSkeleton() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-7 lg:px-8 lg:py-12">
          <div className="mb-4 flex items-center gap-2">
            <Bar className="h-2.5 w-10" />
            <span className="h-2.5 w-1.5 rounded-sm bg-muted" aria-hidden="true" />
            <Bar className="h-2.5 w-16" />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="w-full">
              <Bar className="h-2.5 w-24" />
              <Skeleton className="mt-3 h-9 w-full max-w-md" />
            </div>

            <div className="glass w-full max-w-md shrink-0 rounded-2xl">
              <div className="grid grid-cols-1 divide-y divide-foreground/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-baseline justify-between gap-3 px-3.5 py-3 sm:block sm:px-4"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-2.5 w-20 sm:mt-1.5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-8 lg:py-10">
        <div className="glass-strong rounded-2xl p-3.5 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Skeleton className="h-11 w-full rounded-full sm:w-40" />
              <Skeleton className="h-11 w-full rounded-full sm:w-40" />
            </div>
          </div>
          <div className="mt-3">
            <FilterChipsSkeleton count={7} />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <Bar className="h-3 w-24" />
          <Bar className="h-2.5 w-16" />
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-2"
            >
              <Skeleton className="aspect-4/5 w-full rounded-xl" />
              <div className="space-y-3 px-3 pb-3 pt-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3.5 w-2/5" />
                <div className="flex items-center justify-between border-t border-border/70 pt-4">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="size-9 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------- service details */

export function ServiceDetailsSkeleton() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-8">
          <Bar className="h-2.5 w-28" />
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-7 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:px-8 lg:py-14">
        <div className="min-w-0">
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />

          <div className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-4/3 w-full rounded-xl" />
            ))}
          </div>

          <div className="mt-9">
            <div className="flex flex-wrap items-center gap-2">
              <Pill className="w-28" />
              <Pill className="w-24" />
              <Pill className="w-20" />
            </div>

            <Skeleton className="mt-5 h-10 w-full max-w-lg" />

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Bar className="h-3.5 w-32" />
              <Bar className="h-3.5 w-24" />
              <Bar className="h-3.5 w-28" />
            </div>

            <div className="mt-10 border-t border-border/70 pt-8">
              <Bar className="h-2.5 w-28" />
              <div className="mt-4 space-y-2.5">
                <Bar className="h-3.5 w-full" />
                <Bar className="h-3.5 w-full" />
                <Bar className="h-3.5 w-full" />
                <Bar className="h-3.5 w-2/3" />
              </div>
            </div>

            <div className="mt-10 border-t border-border/70 pt-8">
              <Bar className="h-2.5 w-20" />
              <div className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Bar className="h-2.5 w-20" />
                      <Bar className="h-3.5 w-32" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="min-w-0">
          <div className="glass-strong rounded-2xl p-6">
            <Bar className="h-2.5 w-24" />
            <Skeleton className="mt-3 h-10 w-32" />
            <div className="mt-3 space-y-2">
              <Bar className="h-3 w-full" />
              <Bar className="h-3 w-2/3" />
            </div>
            <div className="mt-6 border-t border-border/70 pt-6">
              <Skeleton className="h-12 w-full rounded-full" />
              <Bar className="mx-auto mt-3 h-2.5 w-40" />
            </div>
            <div className="mt-6 flex items-start gap-3 border-t border-border/70 pt-6">
              <Skeleton className="size-11 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bar className="h-2.5 w-20" />
                <Bar className="h-3.5 w-32" />
              </div>
            </div>
            <div className="mt-5 space-y-2.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <Bar key={index} className="h-3 w-4/5" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- overviews */

export function OverviewSkeleton({
  statCount = 4,
  statColumns = "xl:grid-cols-4",
  panels = 2,
  banner = false,
}: {
  statCount?: number;
  statColumns?: string;
  panels?: number;
  banner?: boolean;
}) {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 px-6 py-7 sm:px-8 sm:py-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full min-w-0">
            <Bar className="h-2.5 w-28" />
            <Skeleton className="mt-4 h-9 w-full max-w-sm" />
            <div className="mt-4 space-y-2.5">
              <Bar className="h-3.5 w-full max-w-md" />
              <Bar className="h-3.5 w-1/2 max-w-xs" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-11 w-44 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <Bar className="h-2.5 w-24" />
          <Bar className="h-2.5 w-28" />
        </div>
        <StatStripSkeleton count={statCount} columns={statColumns} />
      </section>

      {panels > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: panels }).map((_, index) => (
            <Panel key={index} className="p-6">
              <Bar className="h-2.5 w-24" />
              <div className="mt-5 flex items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Bar className="h-2.5 w-44" />
                </div>
              </div>
              <Skeleton className="mt-5 h-1 w-full rounded-full" />
              <Skeleton className="mt-4 h-10 w-40 rounded-full" />
            </Panel>
          ))}
        </section>
      ) : null}

      {banner ? (
        <Panel className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full max-w-md space-y-2.5">
            <Skeleton className="h-5 w-56" />
            <Bar className="h-3.5 w-full" />
          </div>
          <Skeleton className="h-11 w-36 shrink-0 rounded-full" />
        </Panel>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------- vendor services */

export function VendorServicesSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Bar className="h-2.5 w-20" />
          <Skeleton className="mt-3 h-8 w-48" />
          <Bar className="mt-3 h-3 w-56" />
        </div>
        <Skeleton className="h-11 w-36 shrink-0 rounded-full" />
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <Bar className="h-2.5 w-28" />
          <Bar className="h-2.5 w-8" />
        </div>
        <Skeleton className="mt-2 h-1 w-full rounded-full" />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
              index > 0 && "border-t border-border/70"
            )}
          >
            <Skeleton className="aspect-4/3 w-full shrink-0 rounded-xl sm:size-20 sm:aspect-auto" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-5 w-44" />
                <Pill className="w-20" />
              </div>
              <Bar className="mt-2 h-3 w-56 max-w-full" />
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
              <Skeleton className="size-9 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- bookings */

export function BookingsListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-6">
      <StatStripSkeleton count={3} columns="xl:grid-cols-3" className="rounded-2xl" />

      <FilterChipsSkeleton count={5} />

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Panel key={index} className="overflow-hidden">
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
              <Skeleton className="aspect-16/10 w-full shrink-0 rounded-xl sm:aspect-square sm:size-20" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-48 max-w-full" />
                  <Pill className="w-20" />
                </div>
                <Bar className="mt-2 h-3 w-40" />
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  <Bar className="h-3 w-24" />
                  <Bar className="h-3 w-32" />
                  <Bar className="h-3 w-24" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:shrink-0">
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="size-9 rounded-full" />
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

export function BookingsPageSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton actions />
      <BookingsListSkeleton />
    </div>
  );
}

export function BookingDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <Bar className="h-2.5 w-28" />

      <div className="mt-5 flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Bar className="h-2.5 w-20" />
          <Skeleton className="mt-3 h-9 w-full max-w-md" />
          <Bar className="mt-3 h-3.5 w-40" />
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Pill className="w-20" />
          <Skeleton className="h-10 w-36 rounded-full" />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <Panel className="p-6">
            <Bar className="h-2.5 w-20" />
            <div className="mt-5 space-y-5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex gap-4">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bar className="h-3.5 w-40" />
                    <Bar className="h-2.5 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <Bar className="h-2.5 w-20" />
            <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Bar className="h-2.5 w-20" />
                    <Bar className="h-3.5 w-28" />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <Bar className="h-2.5 w-24" />
            <div className="mt-4 space-y-2.5">
              <Bar className="h-3.5 w-full" />
              <Bar className="h-3.5 w-full" />
              <Bar className="h-3.5 w-2/3" />
            </div>
          </Panel>
        </div>

        <aside className="min-w-0">
          <div className="glass-strong overflow-hidden rounded-2xl">
            <Skeleton className="aspect-16/10 w-full rounded-none" />
            <div className="p-6">
              <Bar className="h-2.5 w-24" />
              <Skeleton className="mt-3 h-9 w-28" />
              <div className="mt-3 space-y-2">
                <Bar className="h-3 w-full" />
                <Bar className="h-3 w-3/4" />
              </div>
              <Skeleton className="mt-5 h-11 w-full rounded-full" />
            </div>
            <div className="flex items-start gap-3 border-t border-border/70 p-6">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Bar className="h-2.5 w-20" />
                <Bar className="h-3.5 w-28" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ admin lists */

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton />

      <div className="space-y-6">
        <StatStripSkeleton count={3} columns="xl:grid-cols-3" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-11 w-full rounded-full" />
          <FilterChipsSkeleton count={4} />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <Bar className="h-3 w-32" />
          <Bar className="h-2.5 w-20" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:flex-row lg:items-center",
                index > 0 && "border-t border-border/70"
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-3.5">
                <Skeleton className="size-11 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-4 w-36" />
                    <Pill className="w-16" />
                  </div>
                  <Bar className="mt-2 h-2.5 w-56 max-w-full" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                <Bar className="mr-1 hidden h-2.5 w-24 sm:block" />
                <Skeleton className="h-9 w-24 rounded-full" />
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminUserDetailSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton actions />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <Panel className="p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Skeleton className="size-18 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill className="w-16" />
                  <Pill className="w-20" />
                  <Pill className="w-18" />
                </div>
                <Bar className="mt-3 h-3.5 w-56 max-w-full" />
                <Bar className="mt-2 h-3 w-36" />
              </div>
            </div>
          </Panel>

          <section className="space-y-4">
            <Bar className="h-2.5 w-20" />

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="bg-card p-5">
                  <div className="flex items-center justify-between gap-3">
                    <Bar className="h-2.5 w-20" />
                    <Skeleton className="size-3.5 rounded-full" />
                  </div>
                  <Skeleton className="mt-4 h-8 w-12" />
                  <Bar className="mt-3 h-2.5 w-32" />
                </div>
              ))}
            </div>

            <Panel>
              <div className="flex items-center gap-2.5 border-b border-border/70 px-5 py-3.5">
                <Skeleton className="size-3.5 rounded-full" />
                <Bar className="h-3.5 w-64 max-w-full" />
              </div>
              <div className="flex flex-wrap items-center gap-2 px-5 py-3.5">
                <Skeleton className="h-9 w-40 rounded-full" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </Panel>
          </section>

          <section className="space-y-4">
            <Bar className="h-2.5 w-16" />
            <Panel className="p-5">
              <Bar className="h-3.5 w-full" />
              <Bar className="mt-2.5 h-3 w-2/3" />
            </Panel>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="glass-strong rounded-2xl p-6">
            <Bar className="h-2.5 w-20" />
            <div className="mt-5 space-y-3.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <Bar className="h-2.5 w-16" />
                  <Bar className="h-3 w-24" />
                </div>
              ))}
              <div className="rule" />
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4">
                  <Bar className="h-2.5 w-16" />
                  <Bar className="h-3 w-24" />
                </div>
              ))}
              <div className="rule" />
              <div className="flex items-center justify-between gap-4">
                <Bar className="h-2.5 w-16" />
                <Bar className="h-2.5 w-24" />
              </div>
            </div>
          </div>

          <Panel className="p-5">
            <Bar className="h-2.5 w-16" />
            <div className="mt-3.5 flex items-center gap-2">
              <Pill className="w-16" />
              <Bar className="h-2.5 w-20" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

export function AdminServicesSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton />

      <div className="space-y-6">
        <StatStripSkeleton count={3} columns="xl:grid-cols-3" />

        <div className="flex flex-col gap-3">
          <Skeleton className="h-11 w-full rounded-full" />
          <FilterChipsSkeleton count={4} />
          <FilterChipsSkeleton count={7} size="sm" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <Bar className="h-3 w-24" />
          <Bar className="h-2.5 w-20" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Panel key={index}>
              <div className="flex flex-col gap-4 p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <Skeleton className="size-20 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Skeleton className="h-5 w-52 max-w-full" />
                      <Pill className="w-20" />
                    </div>
                    <Bar className="mt-2.5 h-2.5 w-64 max-w-full" />
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <Bar className="h-2.5 w-24" />
                      <Bar className="h-2.5 w-16" />
                      <Bar className="h-2.5 w-24" />
                      <Bar className="h-2.5 w-20" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3.5">
                  <Skeleton className="h-9 w-28 rounded-full" />
                  <Skeleton className="h-9 w-24 rounded-full" />
                  <Skeleton className="ml-auto h-9 w-24 rounded-full" />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton />

      <div className="space-y-6">
        <StatStripSkeleton count={3} columns="xl:grid-cols-3" />

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Bar className="h-3 w-28" />
            <Skeleton className="h-11 w-full rounded-full sm:w-44" />
          </div>

          <div className="flex items-start gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 backdrop-blur-xl">
            <Skeleton className="mt-0.5 size-3.5 shrink-0 rounded-full" />
            <div className="w-full space-y-2">
              <Bar className="h-2.5 w-full" />
              <Bar className="h-2.5 w-2/3" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-3 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between",
                index > 0 && "border-t border-border/70"
              )}
            >
              <div className="flex min-w-0 items-start gap-3.5">
                <Skeleton className="mt-0.5 size-9 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Pill className="w-20" />
                  </div>
                  <Bar className="mt-2 h-2.5 w-48 max-w-full" />
                  <Bar className="mt-2 h-2.5 w-32" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pl-12.5 sm:pl-13 lg:shrink-0 lg:flex-col lg:items-end lg:gap-1 lg:pl-0">
                <Skeleton className="h-5 w-16" />
                <Bar className="h-2.5 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- profile */

export function ProfileSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton />

      <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
        <Panel className="p-6 sm:p-7">
          <div className="border-b border-border/70 pb-6">
            <Bar className="h-2.5 w-20" />
            <Skeleton className="mt-3 h-6 w-40" />
            <Bar className="mt-2.5 h-3 w-full max-w-sm" />
          </div>

          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="size-18 shrink-0 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-4 border-t border-border/70 pt-6">
                <Skeleton className="hidden h-3 w-4 shrink-0 sm:block" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Bar className="h-2.5 w-24" />
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              </div>
            ))}

            <div className="flex border-t border-border/70 pt-6">
              <Skeleton className="h-11 w-36 rounded-full" />
            </div>
          </div>
        </Panel>

        <aside className="space-y-5">
          <div className="glass-strong rounded-2xl p-6">
            <Bar className="h-2.5 w-20" />
            <Skeleton className="mt-2.5 h-5 w-48" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 border-b border-border/70 py-3 last:border-0"
                >
                  <Bar className="h-3 w-16" />
                  <Bar className="h-3 w-24" />
                </div>
              ))}
            </div>
          </div>

          <Panel className="p-5">
            <Bar className="h-3 w-40" />
            <div className="mt-2.5 space-y-2">
              <Bar className="h-2.5 w-full" />
              <Bar className="h-2.5 w-3/4" />
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- subscription */

export function SubscriptionSkeleton() {
  return (
    <div className="space-y-7">
      <PageHeaderSkeleton />

      <div className="space-y-8">
        <Panel className="p-6 sm:p-7">
          <Bar className="h-2.5 w-24" />
          <Skeleton className="mt-3 h-8 w-64 max-w-full" />
          <Bar className="mt-2.5 h-3 w-full max-w-lg" />

          <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-background/70 px-4 py-3">
                <Bar className="h-2.5 w-20" />
                <Bar className="mt-2 h-3.5 w-24" />
              </div>
            ))}
          </div>
        </Panel>

        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <Panel key={index} className="flex flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <Bar className="h-2.5 w-20" />
                <Pill className="w-16" />
              </div>
              <Skeleton className="mt-4 h-7 w-28" />
              <Bar className="mt-2.5 h-3 w-full" />
              <div className="mt-6 space-y-3 border-t border-border/70 pt-5">
                {Array.from({ length: 4 }).map((_, item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <Skeleton className="size-3.5 shrink-0 rounded-full" />
                    <Bar className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
              <Skeleton className="mt-6 h-11 w-full rounded-full" />
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- auth */

export function AuthFormSkeleton({ withRoleCards = false }: { withRoleCards?: boolean }) {
  return (
    <div>
      <Bar className="h-2.5 w-28" />
      <div className="mt-3 space-y-2.5">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-9 w-3/5" />
      </div>
      <div className="mt-3 space-y-2.5">
        <Bar className="h-3.5 w-full" />
        <Bar className="h-3.5 w-3/4" />
      </div>

      {withRoleCards ? (
        <div className="mt-7">
          <Bar className="h-2.5 w-40" />
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="rounded-xl border border-border bg-card/60 px-4 py-3">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="mt-1.5 h-2.5 w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Skeleton className="mt-7 h-12 w-full rounded-full" />
      )}

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <Skeleton className="h-2.5 w-24" />
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ))}
        <Skeleton className="h-12 w-full rounded-full" />
      </div>

      <Skeleton className="mx-auto mt-8 h-3 w-52" />
    </div>
  );
}

/* ------------------------------------------------------------- edit form */

export function ServiceFormSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="border-b border-border/70 pb-6">
        <Bar className="h-2.5 w-24" />
        <Bar className="mt-5 h-2.5 w-20" />
        <Skeleton className="mt-3 h-8 w-56 max-w-full" />
        <Bar className="mt-3 h-3 w-full max-w-md" />
      </div>

      <div className="mt-8 space-y-8">
        {Array.from({ length: 4 }).map((_, section) => (
          <div
            key={section}
            className="border-t border-border/70 pt-7 first:border-t-0 first:pt-0"
          >
            <div className="flex gap-4">
              <Skeleton className="hidden h-3 w-4 shrink-0 sm:block" />
              <div className="min-w-0 flex-1">
                <Skeleton className="h-6 w-44" />
                <Bar className="mt-2 h-3 w-full max-w-sm" />

                <div className="mt-5 space-y-4">
                  <div className="space-y-2">
                    <Bar className="h-2.5 w-24" />
                    <Skeleton className="h-11 w-full rounded-xl" />
                  </div>

                  {section === 2 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="aspect-square w-full rounded-xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Skeleton className="h-11 w-full rounded-xl" />
                      <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex border-t border-border/70 pt-7">
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
