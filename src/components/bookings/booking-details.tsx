"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarDays,
  CloudOff,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
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
import { formatCurrency, formatDate, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

export function BookingDetails({ id }: { id: string }) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch<Booking>(`/bookings/${id}`)
      .then((data) => {
        if (active) setBooking(data);
      })
      .catch((cause) => {
        if (active) setError(getErrorMessage(cause));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const cancel = async () => {
    setIsCancelling(true);

    try {
      await apiFetch(`/bookings/${id}/cancel`, { method: "PATCH" });
      setBooking((current) => (current ? { ...current, status: "cancelled" } : current));
      toast.success("Request cancelled");
      setShowCancel(false);
    } catch (cause) {
      toast.error(getErrorMessage(cause));
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <EmptyState
        icon={CloudOff}
        title="We couldn't load this booking"
        description={error ?? "The booking may have been removed."}
        action={
          <Link
            href="/dashboard/customer/bookings"
            className={cn(buttonVariants({ size: "lg" }), "h-10 gap-2 px-5")}
          >
            <ArrowLeft className="size-4" />
            Back to my bookings
          </Link>
        }
      />
    );
  }

  const service = booking.service;
  const vendorName = booking.vendor?.businessName || booking.vendor?.name || "Vendor";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/customer/bookings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          My bookings
        </Link>

        {booking.status === "pending" ? (
          <Button
            variant="outline"
            className="h-9 gap-1.5 text-destructive hover:text-destructive"
            onClick={() => setShowCancel(true)}
          >
            <XCircle className="size-4" />
            Cancel request
          </Button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">
          {service?.serviceName ?? "Service removed"}
        </h1>
        <StatusBadge status={booking.status} className="text-xs" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Request details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Detail icon={CalendarDays} label="Event date" value={formatDate(booking.eventDate)} />
              <Detail icon={MapPin} label="Event location" value={booking.eventLocation} />
              <Detail icon={MessageSquare} label="Requested on" value={formatDate(booking.createdAt)} />
              <Detail
                icon={CalendarDays}
                label="Last update"
                value={formatDateTime(booking.updatedAt ?? booking.createdAt)}
              />
            </div>

            <Separator />

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Your message
              </p>
              <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed">{booking.message}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Vendor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{vendorName}</p>
              {booking.vendor?.name && booking.vendor.businessName ? (
                <p className="text-sm text-muted-foreground">{booking.vendor.name}</p>
              ) : null}
              {booking.customer?.email ? (
                <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-3.5" />
                  {booking.customer.email}
                </p>
              ) : null}
              {service ? (
                <>
                  <Separator />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Starting price</span>
                    <span className="font-medium">{formatCurrency(service.price)}</span>
                  </div>
                  <Link
                    href={`/services/${service._id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 w-full")}
                  >
                    View service
                  </Link>
                </>
              ) : null}
            </CardContent>
          </Card>

          {service?.images?.[0] ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/80">
              <Image
                src={service.images[0]}
                alt={service.serviceName ?? "Service"}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
            <AlertDialogDescription>
              {service?.serviceName ?? "This request"} on {formatDate(booking.eventDate)} will be
              withdrawn. You can send a new request later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void cancel();
              }}
              disabled={isCancelling}
            >
              {isCancelling ? <Loader2 className="size-4 animate-spin" /> : null}
              Cancel request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
