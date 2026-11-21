"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { CalendarDays, Loader2, MapPin, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { Booking } from "@/types";

export function BookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [pendingCancel, setPendingCancel] = useState<Booking | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

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

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No booking requests yet"
        description="Find a service you love and send your first request — it takes a minute."
        action={
          <Link href="/services" className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}>
            Browse services
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <Card key={booking._id} className="overflow-hidden border-border/80">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
              {booking.service?.images?.[0] ? (
                <Image
                  src={booking.service.images[0]}
                  alt={booking.service.serviceName ?? "Service"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-medium">
                  {booking.service?.serviceName ?? "Service removed"}
                </h2>
                <StatusBadge status={booking.status} />
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                {booking.vendor?.businessName || booking.vendor?.name || "Vendor"} ·{" "}
                {booking.service ? formatCurrency(booking.service.price) : "—"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarDays className="size-3.5" />
                  {formatDate(booking.eventDate)}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {booking.eventLocation}
                </span>
                <span>Requested {formatDate(booking.createdAt)}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/dashboard/customer/bookings/${booking._id}`}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9")}
              >
                Details
              </Link>
              {booking.status === "pending" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 text-destructive hover:text-destructive"
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
          </CardContent>
        </Card>
      ))}

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
