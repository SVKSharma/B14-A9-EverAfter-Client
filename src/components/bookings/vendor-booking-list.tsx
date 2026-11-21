"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Check, Loader2, Mail, MapPin, MessageSquare, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking, BookingStatus } from "@/types";

export function VendorBookingList({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [busyId, setBusyId] = useState<string | null>(null);

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

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No booking requests yet"
        description="When a couple requests one of your services it will appear here for you to accept or decline."
        action={
          <Link href="/dashboard/vendor/services" className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}>
            Manage my services
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => {
        const isPending = booking.status === "pending";
        const customerName = booking.customer?.name ?? "Customer";

        return (
          <Card key={booking._id} className="overflow-hidden border-border/80">
            <CardContent className="space-y-4 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                  {booking.service?.images?.[0] ? (
                    <Image
                      src={booking.service.images[0]}
                      alt={booking.service.serviceName ?? "Service"}
                      fill
                      sizes="64px"
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

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      {customerName}
                    </span>
                    {booking.customer?.email ? (
                      <span className="inline-flex items-center gap-1">
                        <Mail className="size-3.5" />
                        {booking.customer.email}
                      </span>
                    ) : null}
                    <span>Requested {formatDate(booking.createdAt)}</span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {booking.eventLocation}
                    </span>
                    <span>Event {formatDate(booking.eventDate)}</span>
                  </div>
                </div>

                {isPending ? (
                  <div className="flex shrink-0 gap-1.5">
                    <Button
                      size="sm"
                      className="h-9 gap-1.5"
                      onClick={() => void respond(booking, "accepted")}
                      disabled={busyId === booking._id}
                    >
                      {busyId === booking._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5 text-destructive hover:text-destructive"
                      onClick={() => void respond(booking, "rejected")}
                      disabled={busyId === booking._id}
                    >
                      <X className="size-4" />
                      Decline
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="rounded-xl bg-secondary/40 px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Message from {customerName.split(" ")[0]}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">{booking.message}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
