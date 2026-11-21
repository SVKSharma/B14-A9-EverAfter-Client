import Link from "next/link";
import {
  CalendarCheck,
  CreditCard,
  ShieldOff,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/shared/stat-card";
import { cn } from "@/lib/utils";
import type { AdminStats } from "@/types";

export function AdminOverview({ stats, name }: { stats: AdminStats; name: string }) {
  const firstName = name.split(/\s+/)[0] || "there";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-plum px-6 py-10 text-white shadow-lg sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Admin dashboard</p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            {stats.services.pending > 0
              ? `${stats.services.pending} listing${
                  stats.services.pending === 1 ? " is" : "s are"
                } waiting for review.`
              : "Everything is reviewed and the marketplace is running smoothly."}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/dashboard/admin/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-background px-5 text-foreground hover:bg-background/90"
              )}
            >
              <Store className="size-4" />
              Moderate services
            </Link>
            <Link
              href="/dashboard/admin/users"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <Users className="size-4" />
              Manage users
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="platform-stats" className="space-y-4">
        <h2 id="platform-stats" className="font-heading text-2xl font-semibold">
          Platform health
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
            hint="Read-only, written by Stripe"
          />
        </div>
      </section>

      <Card className="border-border/80 bg-secondary/30">
        <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-heading text-lg font-semibold">Transactions are read-only</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Payment status only changes when Stripe confirms it through the verified webhook.
            </p>
          </div>
          <Link
            href="/dashboard/admin/transactions"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 shrink-0 px-5")}
          >
            View payments
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
