"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Loader2, Mail, MapPin, MessageSquare, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { useTitleCount } from "@/hooks/use-title-count";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

type Filter = "all" | BookingStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Declined" },
  { value: "cancelled", label: "Cancelled" },
];

export function VendorBookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const respond = async (booking: Booking, status: Extract<BookingStatus, "accepted" | "rejected">) => {
    setBusyId(booking._id);

    try {
      await apiFetch(`/bookings/${booking._id}/status`, {
        method: "PATCH",
        body: { status },
      });

      setBookings((current) =>
        current.map((item) => (item._id === booking._id ? { ...item, status } : item))
      );
      toast.success(status === "accepted" ? "Request accepted" : "Request declined");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    return {
      pending: bookings.filter((item) => item.status === "pending").length,
      accepted: bookings.filter((item) => item.status === "accepted").length,
      rejected: bookings.filter((item) => item.status === "rejected").length,
    };
  }, [bookings]);

  useTitleCount(counts.pending);

  const visible = useMemo(() => {
    const list = filter === "all" ? bookings : bookings.filter((item) => item.status === filter);
    // Pending replies first, then most recent.
    return [...list].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [bookings, filter]);

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No booking requests yet"
        description="When a couple requests one of your services it will appear here for you to accept or decline."
        action={
          <Link
            href="/dashboard/vendor/services"
            className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-5")}
          >
            Manage my services
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Awaiting reply</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-[#8a6c3a]">
            {counts.pending}
          </p>
        </div>
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Accepted</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-[#4f6b52]">
            {counts.accepted}
          </p>
        </div>
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Declined</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-foreground">
            {counts.rejected}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase transition-colors",
              filter === item.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
            {item.value === "pending" && counts.pending > 0 ? (
              <span className="ml-1.5 tabular-nums opacity-70">{counts.pending}</span>
            ) : null}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border px-6 py-14 text-center">
          <p className="text-sm text-muted-foreground">Nothing in this view right now.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((booking) => {
            const isPending = booking.status === "pending";
            const customerName = booking.customer?.name ?? "Customer";
            const initial = customerName.trim().charAt(0).toUpperCase() || "C";

            return (
              <article
                key={booking._id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl transition-colors",
                  isPending ? "border-primary/25" : "border-border/70"
                )}
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 flex-1 items-start gap-3.5">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
                        {booking.service?.images?.[0] ? (
                          <Image
                            src={booking.service.images[0]}
                            alt={booking.service.serviceName ?? "Service"}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid h-full place-items-center text-[0.6rem] tracking-[0.1em] text-muted-foreground uppercase">
                            No photo
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate font-heading text-lg leading-tight tracking-tight text-foreground">
                            {booking.service?.serviceName ?? "Service removed"}
                          </h2>
                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-secondary font-heading text-[0.6rem] text-primary">
                              {initial}
                            </span>
                            {customerName}
                          </span>
                          {booking.customer?.email ? (
                            <span className="inline-flex min-w-0 items-center gap-1.5">
                              <Mail className="size-3.5 shrink-0" strokeWidth={1.6} />
                              <span className="truncate">{booking.customer.email}</span>
                            </span>
                          ) : null}
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 shrink-0" strokeWidth={1.6} />
                            {booking.eventLocation}
                          </span>
                          <span>
                            Event <span className="text-foreground">{formatDate(booking.eventDate)}</span>
                          </span>
                          <span>Requested {formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {isPending ? (
                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          size="sm"
                          className="h-9 gap-1.5 rounded-full px-4"
                          onClick={() => void respond(booking, "accepted")}
                          disabled={busyId === booking._id}
                        >
                          {busyId === booking._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Check className="size-3.5" />
                          )}
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5 rounded-full px-4 text-destructive hover:text-destructive"
                          onClick={() => void respond(booking, "rejected")}
                          disabled={busyId === booking._id}
                        >
                          <X className="size-3.5" />
                          Decline
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-xl border border-border/60 bg-background/50 px-4 py-3">
                    <p className="text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
                      Message from {customerName.split(" ")[0]}
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                      {booking.message}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
