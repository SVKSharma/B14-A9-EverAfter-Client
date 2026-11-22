import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Mail,
  ShieldOff,
  Store,
  UserRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { serverApiFetch } from "@/lib/server-api";
import { formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminUserDetail } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await serverApiFetch<AdminUserDetail>(`/admin/users/${encodeURIComponent(id)}`);

  return { title: user?.name ?? "User Details" };
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await serverApiFetch<AdminUserDetail>(`/admin/users/${encodeURIComponent(id)}`);

  if (!user) {
    notFound();
  }

  const isPremium = user.subscriptionPlan === "premium";
  const reviewCount = user.counts.pendingServices;

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Admin dashboard", href: "/dashboard/admin" },
          { label: "Users", href: "/dashboard/admin/users" },
          { label: user.name },
        ]}
        eyebrow="Account"
        title={user.name}
        description={user.businessName ?? "No business name on file."}
        actions={
          <Link
            href="/dashboard/admin/users"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-5")}
          >
            All users
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div className="space-y-6">
          <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl sm:p-7">
            <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute -right-16 -top-20 size-48 rounded-full bg-gold/15 blur-[90px]" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative size-18 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-border/60">
                {user.image ? (
                  <Image src={user.image} alt={user.name} fill sizes="72px" className="object-cover" />
                ) : (
                  <span className="grid h-full place-items-center font-heading text-2xl text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-full border border-border bg-background/70 px-2.5 text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
                    {user.role}
                  </span>
                  {isPremium ? (
                    <span className="inline-flex h-6 items-center rounded-full border border-gold/40 bg-gold/[0.12] px-2.5 text-[0.6rem] tracking-[0.12em] text-[#8a6c3a] uppercase">
                      Premium
                    </span>
                  ) : (
                    <span className="inline-flex h-6 items-center rounded-full border border-border bg-background px-2.5 text-[0.6rem] tracking-[0.12em] text-muted-foreground uppercase">
                      Free plan
                    </span>
                  )}
                  {user.isBlocked ? (
                    <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/[0.07] px-2.5 text-[0.6rem] tracking-[0.12em] text-destructive uppercase">
                      <ShieldOff className="size-3" strokeWidth={2} />
                      Blocked
                    </span>
                  ) : null}
                </div>

                <p className="mt-3 flex items-center gap-2 text-sm text-foreground/85">
                  <Mail className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                  <span className="truncate">{user.email}</span>
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.6} />
                  Joined {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="activity-heading" className="space-y-4">
            <h2 id="activity-heading" className="eyebrow text-muted-foreground">
              Activity
            </h2>

            <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
              <div className="bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-muted-foreground">Services</p>
                  <Store className="size-3.5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="mt-4 font-heading text-[2.1rem] leading-none tracking-tight text-foreground">
                  {user.counts.services}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {user.counts.approvedServices} approved · {reviewCount} in review
                </p>
              </div>

              <div className="bg-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-muted-foreground">Bookings</p>
                  <CalendarClock className="size-3.5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="mt-4 font-heading text-[2.1rem] leading-none tracking-tight text-foreground">
                  {user.counts.bookings}
                </p>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  {user.counts.pendingBookings} awaiting a reply
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
              <div className="flex items-center gap-2.5 border-b border-border/70 px-5 py-3.5">
                {reviewCount > 0 ? (
                  <Clock3 className="size-3.5 shrink-0 text-[#8a6c3a]" strokeWidth={1.8} />
                ) : (
                  <CheckCircle2 className="size-3.5 shrink-0 text-[#4f6b52]" strokeWidth={1.8} />
                )}
                <p className="text-sm text-foreground/85">
                  {reviewCount > 0
                    ? `${reviewCount} listing${reviewCount === 1 ? "" : "s"} waiting for review.`
                    : "No listings are waiting for review."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 px-5 py-3.5">
                <Link
                  href="/dashboard/admin/services"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "h-9 rounded-full px-4"
                  )}
                >
                  Moderate services
                </Link>
                <Link
                  href="/dashboard/admin/transactions"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "h-9 gap-1.5 rounded-full px-4"
                  )}
                >
                  <CreditCard className="size-3.5" />
                  Payments
                </Link>
              </div>
            </div>
          </section>

          <section aria-labelledby="blocked-note" className="space-y-4">
            <h2 id="blocked-note" className="eyebrow text-muted-foreground">
              Access
            </h2>
            <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                <ShieldOff className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.6} />
                Blocking is managed from{" "}
                <Link
                  href="/dashboard/admin/users"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Manage users
                </Link>{" "}
                so a blocked account never keeps a live session.
              </p>
              <p className="mt-2.5 pl-6.5 text-xs leading-relaxed text-muted-foreground">
                {user.isBlocked
                  ? "This account is currently blocked and cannot sign in."
                  : "This account has normal access to the marketplace."}
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="glass-strong rounded-2xl p-6">
            <p className="eyebrow text-primary">Account</p>

            <dl className="mt-5 space-y-3.5">
              <Row label="Role" value={user.role} className="capitalize" />
              <Row label="Business" value={user.businessName ?? "—"} />
              <div className="rule" />
              <Row label="Plan" value={isPremium ? "Premium" : "Free"} />
              <Row
                label="Premium until"
                value={isPremium ? formatDateTime(user.subscriptionExpiresAt) : "—"}
              />
              <div className="rule" />
              <Row label="User ID" value={user.id} mono />
            </dl>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <UserRound className="size-3.5 text-muted-foreground" strokeWidth={1.6} />
              <p className="eyebrow text-muted-foreground">Status</p>
            </div>
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              {user.isBlocked ? (
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-destructive/25 bg-destructive/[0.07] px-2.5 text-[0.68rem] font-medium tracking-[0.08em] text-destructive uppercase">
                  <ShieldOff className="size-3" strokeWidth={2.2} />
                  Blocked
                </span>
              ) : (
                <span className="inline-flex h-6 items-center rounded-full border border-[#8ba185]/45 bg-[#a0aa96]/14 px-2.5 text-[0.68rem] font-medium tracking-[0.08em] text-[#4f6b52] uppercase">
                  Active
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {user.isBlocked ? "No marketplace access" : "Can sign in"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  className,
  mono,
}: {
  label: string;
  value: string;
  className?: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="shrink-0 text-[0.7rem] tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          "min-w-0 truncate text-right font-medium text-foreground",
          mono && "font-mono text-[0.7rem] text-muted-foreground",
          className
        )}
      >
        {value}
      </dd>
    </div>
  );
}
