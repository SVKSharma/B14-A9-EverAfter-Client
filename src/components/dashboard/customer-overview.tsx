import Link from "next/link";
import { CalendarCheck, CalendarClock, CheckCircle2, XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";
import type { CustomerStats } from "@/types";

export function CustomerOverview({ stats, name }: { stats: CustomerStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-plum px-6 py-10 text-white shadow-lg sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Customer dashboard
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            {stats.bookings.total === 0
              ? "Plan your day, request bookings and keep everything in one calm place."
              : `${stats.bookings.accepted} confirmed · ${stats.bookings.pending} awaiting a reply.`}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-background px-5 text-foreground hover:bg-background/90"
              )}
            >
              Browse services
            </Link>
            <Link
              href="/dashboard/customer/bookings"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <CalendarCheck className="size-4" />
              My bookings
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="customer-stats" className="space-y-4">
        <h2 id="customer-stats" className="font-heading text-2xl font-semibold">
          Your planning
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </section>
    </div>
  );
}
