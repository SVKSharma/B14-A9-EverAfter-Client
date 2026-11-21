import Link from "next/link";
import {
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Crown,
  Store,
  XCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";
import type { VendorStats } from "@/types";

export function VendorOverview({ stats, name }: { stats: VendorStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";
  const isPremium = stats.plan === "premium";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-plum px-6 py-10 text-white shadow-lg sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            Vendor dashboard
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            {stats.bookings.pending > 0
              ? `You have ${stats.bookings.pending} request${
                  stats.bookings.pending === 1 ? "" : "s"
                } waiting for a reply.`
              : "Showcase your services and turn enquiries into confirmed bookings."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/vendor/bookings"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-background px-5 text-foreground hover:bg-background/90"
              )}
            >
              <CalendarCheck className="size-4" />
              Booking requests
            </Link>
            <Link
              href="/dashboard/vendor/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Store className="size-4" />
              My services
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="vendor-stats" className="space-y-4">
        <h2 id="vendor-stats" className="font-heading text-2xl font-semibold">
          At a glance
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={Store}
            label="Services"
            value={stats.services.total}
            hint={`${stats.services.active} live · ${stats.services.pending} in review`}
            tone="primary"
          />
          <StatCard
            icon={CalendarClock}
            label="Pending requests"
            value={stats.bookings.pending}
            hint={stats.bookings.pending > 0 ? "Waiting for your reply" : "All caught up"}
            tone={stats.bookings.pending > 0 ? "warning" : "default"}
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted bookings"
            value={stats.bookings.accepted}
            hint="Confirmed with couples"
            tone="success"
          />
          <StatCard
            icon={XCircle}
            label="Declined"
            value={stats.bookings.rejected}
            hint="Requests you turned down"
          />
          <StatCard
            icon={Crown}
            label="Plan"
            value={isPremium ? "Premium" : "Free"}
            hint={
              isPremium
                ? "Unlimited services and a premium badge"
                : `${stats.quota.remaining ?? 0} of ${stats.quota.limit ?? 3} service slots left`
            }
            tone={isPremium ? "primary" : "default"}
          />
        </div>
      </section>

      {!isPremium ? (
        <Card className="border-border/80 bg-secondary/30">
          <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-lg font-semibold">Need more than three services?</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Premium removes the listing limit and adds a badge to every card.
              </p>
            </div>
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(buttonVariants({ size: "lg" }), "h-10 shrink-0 px-5")}
            >
              <Crown className="size-4" />
              Upgrade
            </Link>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
