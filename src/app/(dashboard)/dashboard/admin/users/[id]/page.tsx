import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, ShieldOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serverApiFetch } from "@/lib/server-api";
import { formatDate } from "@/lib/format";
import type { AdminUserDetail } from "@/types";

export const metadata: Metadata = { title: "User Details" };

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

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Manage users
      </Link>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative size-16 overflow-hidden rounded-full bg-secondary">
          {user.image ? (
            <Image src={user.image} alt={user.name} fill sizes="64px" className="object-cover" />
          ) : (
            <span className="grid h-full place-items-center font-heading text-2xl font-semibold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">{user.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {user.email}
            </span>
            <span className="capitalize">{user.role}</span>
            {user.isBlocked ? (
              <span className="inline-flex items-center gap-1 text-destructive">
                <ShieldOff className="size-3.5" />
                Blocked
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Role" value={user.role} className="capitalize" />
            <Row label="Business name" value={user.businessName ?? "—"} />
            <Separator />
            <Row
              label="Plan"
              value={user.subscriptionPlan === "premium" ? "Premium" : "Free"}
            />
            <Row
              label="Premium until"
              value={
                user.subscriptionPlan === "premium"
                  ? formatDate(user.subscriptionExpiresAt)
                  : "—"
              }
            />
            <Separator />
            <Row label="Joined" value={formatDate(user.createdAt)} />
            <Row label="User ID" value={user.id} className="font-mono text-xs" />
          </CardContent>
        </Card>

        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Row label="Services" value={String(user.counts.services)} />
            <Row label="Approved services" value={String(user.counts.approvedServices)} />
            <Row label="Services in review" value={String(user.counts.pendingServices)} />
            <Separator />
            <Row label="Bookings" value={String(user.counts.bookings)} />
            <Row label="Pending requests" value={String(user.counts.pendingBookings)} />
            <p className="pt-2 text-xs text-muted-foreground">
              Blocking is managed from{" "}
              <Link href="/dashboard/admin/users" className="font-medium text-primary hover:underline">
                Manage users
              </Link>{" "}
              so a blocked account never keeps a live session.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-right font-medium ${className ?? ""}`}>{value}</span>
    </div>
  );
}
