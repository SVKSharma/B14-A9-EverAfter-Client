import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Crown,
  Store,
  XCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { cn } from "@/lib/utils";
import type { VendorStats } from "@/types";

export function VendorOverview({ stats, name }: { stats: VendorStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";
  const isPremium = stats.plan === "premium";

  const description =
    stats.bookings.pending > 0
      ? `You have ${stats.bookings.pending} request${
          stats.bookings.pending === 1 ? "" : "s"
        } waiting for a reply.`
      : "Showcase your services and turn enquiries into confirmed bookings.";

  return (
    <div className="space-y-8">
      <OverviewHeader
        eyebrow="Vendor dashboard"
        title={`Welcome back, ${firstName}`}
        description={description}
        actions={
          <>
            <Link
              href="/dashboard/vendor/bookings"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-5")}
            >
              <CalendarCheck className="size-4" />
              Booking requests
            </Link>
            <Link
              href="/dashboard/vendor/services"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 rounded-full px-5"
              )}
            >
              <Store className="size-4" />
              My services
            </Link>
          </>
        }
      />

      <section aria-labelledby="vendor-stats" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="vendor-stats" className="eyebrow text-muted-foreground">
            At a glance
          </h2>
          <Link
            href="/dashboard/vendor/services"
            className="group inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase"
          >
            Manage listings
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <StatStrip>
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
        </StatStrip>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <p className="eyebrow text-muted-foreground">Your plan</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-border bg-background text-primary">
              <Crown className="size-4" strokeWidth={1.7} />
            </span>
            <div>
              <p className="font-heading text-2xl leading-none text-foreground">
                {isPremium ? "Premium" : "Free"}
              </p>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {isPremium
                  ? "Unlimited services and a premium badge"
                  : `${stats.quota.remaining ?? 0} of ${stats.quota.limit ?? 3} service slots left`}
              </p>
            </div>
          </div>
          {!isPremium ? (
            <div className="mt-5">
              <div className="h-1 w-full overflow-hidden rounded-full bg-beige">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(
                      100,
                      ((stats.services.total || 0) / (stats.quota.limit || 3)) * 100
                    )}%`,
                  }}
                />
              </div>
              <Link
                href="/dashboard/vendor/subscription"
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-[0.7rem] tracking-[0.1em] text-primary-foreground uppercase"
              >
                <Crown className="size-3.5" />
                Upgrade to premium
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-6">
          <p className="eyebrow text-muted-foreground">Next step</p>
          <p className="mt-4 font-heading text-xl leading-snug tracking-tight">
            {stats.bookings.pending > 0
              ? "Reply to your waiting couples"
              : stats.services.total === 0
                ? "Publish your first service"
                : "Keep your listings fresh"}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {stats.bookings.pending > 0
              ? "Couples are waiting on a yes or no. Replies are what turn interest into bookings."
              : stats.services.total === 0
                ? "Add photos, a starting price and a short description so couples can find you."
                : "Update your availability and starting prices so couples see accurate information."}
          </p>
          <Link
            href={
              stats.bookings.pending > 0 ? "/dashboard/vendor/bookings" : "/dashboard/vendor/services"
            }
            className="mt-5 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase hover:underline"
          >
            {stats.bookings.pending > 0 ? "View requests" : "Manage services"}
            <ArrowUpRight className="size-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
