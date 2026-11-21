import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Compass,
  XCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types";

export function CustomerOverview({ stats, name }: { stats: CustomerStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";

  const description =
    stats.bookings.total === 0
      ? "Plan your day, request bookings and keep everything in one calm place."
      : `${stats.bookings.accepted} confirmed · ${stats.bookings.pending} awaiting a reply.`;

  return (
    <div className="space-y-8">
      <OverviewHeader
        eyebrow="Customer dashboard"
        title={`Welcome back, ${firstName}`}
        description={description}
        actions={
          <>
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-5")}
            >
              <Compass className="size-4" />
              Browse services
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 rounded-full px-5"
              )}
            >
              <CalendarCheck className="size-4" />
              My bookings
            </Link>
          </>
        }
      />

      <section aria-labelledby="customer-stats" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="customer-stats" className="eyebrow text-muted-foreground">
            Your planning
          </h2>
          <Link
            href="/dashboard/customer/bookings"
            className="group inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase"
          >
            All bookings
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <StatStrip>
          <StatCard
            icon={CalendarCheck}
            label="Requests sent"
            value={stats.bookings.total}
            hint="Across all services"
            tone="primary"
          />
          <StatCard
            icon={CalendarClock}
            label="Pending"
            value={stats.bookings.pending}
            hint="Waiting for a vendor reply"
            tone={stats.bookings.pending > 0 ? "warning" : "default"}
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted"
            value={stats.bookings.accepted}
            hint="Confirmed with vendors"
            tone="success"
          />
          <StatCard
            icon={XCircle}
            label="Declined / cancelled"
            value={stats.bookings.rejected + stats.bookings.cancelled}
            hint="Not going ahead"
          />
        </StatStrip>
      </section>

      {stats.bookings.total === 0 ? (
        <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-7">
          <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-lg">
              <p className="eyebrow text-primary">Start here</p>
              <h2 className="mt-3 font-heading text-2xl leading-snug tracking-tight">
                Your shortlist is waiting to be written
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Browse the collection, find the studios that feel like you, and send your first
                enquiry. It takes two minutes.
              </p>
            </div>
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 shrink-0 gap-2 rounded-full px-5"
              )}
            >
              Explore services
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
