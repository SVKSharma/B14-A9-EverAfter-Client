import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  CreditCard,
  ShieldOff,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { cn } from "@/lib/utils";
import type { AdminStats } from "@/types";

export function AdminOverview({ stats, name }: { stats: AdminStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";

  const description =
    stats.services.pending > 0
      ? `${stats.services.pending} listing${
          stats.services.pending === 1 ? " is" : "s are"
        } waiting for review.`
      : "Everything is reviewed and the marketplace is running smoothly.";

  return (
    <div className="space-y-8">
      <OverviewHeader
        eyebrow="Admin dashboard"
        title={`Welcome back, ${firstName}`}
        description={description}
        actions={
          <>
            <Link
              href="/dashboard/admin/services"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-5")}
            >
              <Store className="size-4" />
              Moderate services
            </Link>
            <Link
              href="/dashboard/admin/users"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 rounded-full px-5"
              )}
            >
              <Users className="size-4" />
              Manage users
            </Link>
          </>
        }
      />

      <section aria-labelledby="platform-stats" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 id="platform-stats" className="eyebrow text-muted-foreground">
            Platform health
          </h2>
          <Link
            href="/dashboard/admin/transactions"
            className="group inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase"
          >
            Payments
            <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <StatStrip className="xl:grid-cols-3">
          <StatCard
            icon={Users}
            label="Accounts"
            value={stats.users.total}
            hint={`${stats.users.customers} customers · ${stats.users.vendors} vendors`}
            tone="primary"
          />
          <StatCard
            icon={ShieldOff}
            label="Blocked"
            value={stats.users.blocked}
            hint="Accounts without access"
            tone={stats.users.blocked > 0 ? "warning" : "default"}
          />
          <StatCard
            icon={Store}
            label="Services"
            value={stats.services.total}
            hint={`${stats.services.approved} approved · ${stats.services.pending} pending`}
          />
          <StatCard
            icon={CalendarCheck}
            label="Bookings"
            value={stats.bookings.total}
            hint={`${stats.bookings.pending} awaiting a vendor`}
          />
          <StatCard
            icon={Wallet}
            label="Premium vendors"
            value={stats.subscriptions.premiumVendors}
            hint={`${stats.subscriptions.successful} successful payments`}
            tone="success"
          />
          <StatCard
            icon={CreditCard}
            label="Transactions"
            value={stats.subscriptions.transactions}
            hint="Written by Stripe only"
          />
        </StatStrip>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-lg tracking-tight">Transactions are read-only</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Payment status only changes when Stripe confirms it through the verified webhook.
          </p>
        </div>
        <Link
          href="/dashboard/admin/transactions"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 shrink-0 rounded-full px-5"
          )}
        >
          View payments
        </Link>
      </section>
    </div>
  );
}
