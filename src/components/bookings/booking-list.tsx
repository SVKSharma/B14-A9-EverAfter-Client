"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowUpRight, CalendarDays, Loader2, MapPin, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/format";
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

export function BookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  const confirmCancel = async () => {
    if (!pendingCancel) return;
    const id = pendingCancel._id;
    setBusyId(id);

    try {
      await apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
      setBookings((current) =>
        current.map((item) => (item._id === id ? { ...item, status: "cancelled" } : item))
      );
      toast.success("Request cancelled");
      setPendingCancel(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(
    () => ({
      pending: bookings.filter((item) => item.status === "pending").length,
      accepted: bookings.filter((item) => item.status === "accepted").length,
      total: bookings.length,
    }),
    [bookings]
  );

  const visible = useMemo(() => {
    const list = filter === "all" ? bookings : bookings.filter((item) => item.status === filter);
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [bookings, filter]);

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No booking requests yet"
        description="Find a service you love and send your first request — it takes a minute."
        action={
          <Link
            href="/services"
            className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-5")}
          >
            Browse services
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Requests sent</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-foreground">
            {counts.total}
          </p>
        </div>
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Awaiting reply</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-[#8a6c3a]">
            {counts.pending}
          </p>
        </div>
        <div className="bg-card p-5">
          <p className="eyebrow text-muted-foreground">Confirmed</p>
          <p className="mt-3 font-heading text-[2rem] leading-none tracking-tight text-[#4f6b52]">
            {counts.accepted}
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
            const vendorName =
              booking.vendor?.businessName || booking.vendor?.name || "Vendor";

            return (
              <article
                key={booking._id}
                className="group overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl transition-colors hover:border-foreground/20"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5">
                  <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60 sm:aspect-square sm:size-20">
                    {booking.service?.images?.[0] ? (
                      <Image
                        src={booking.service.images[0]}
                        alt={booking.service.serviceName ?? "Service"}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
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

                    <p className="mt-1 text-xs text-muted-foreground">
                      {vendorName}
                      {booking.service ? (
                        <>
                          <span className="mx-1.5 text-muted-foreground/50">·</span>
                          {formatCurrency(booking.service.price)}
                        </>
                      ) : null}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.6} />
                        <span className="text-foreground">{formatDate(booking.eventDate)}</span>
                      </span>
                      <span className="inline-flex min-w-0 items-center gap-1.5">
                        <MapPin className="size-3.5 shrink-0" strokeWidth={1.6} />
                        <span className="truncate">{booking.eventLocation}</span>
                      </span>
                      <span>Requested {formatDate(booking.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:shrink-0">
                    <Link
                      href={`/dashboard/customer/bookings/${booking._id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-9 gap-1.5 rounded-full px-4"
                      )}
                    >
                      Details
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                    {booking.status === "pending" ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9 rounded-full text-destructive hover:bg-destructive/[0.07] hover:text-destructive"
                        aria-label="Cancel request"
                        onClick={() => setPendingCancel(booking)}
                        disabled={busyId === booking._id}
                      >
                        {busyId === booking._id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <XCircle className="size-4" />
                        )}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={Boolean(pendingCancel)}
        onOpenChange={(open) => (!open ? setPendingCancel(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingCancel?.service?.serviceName ?? "This request"} on{" "}
              {formatDate(pendingCancel?.eventDate)} will be withdrawn. You can send a new request
              later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(busyId)}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmCancel();
              }}
              disabled={Boolean(busyId)}
            >
              {busyId ? <Loader2 className="size-4 animate-spin" /> : null}
              Cancel request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
