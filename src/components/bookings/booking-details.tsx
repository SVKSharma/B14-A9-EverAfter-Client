"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CloudOff,
  Loader2,
  MapPin,
  MessageSquare,
  X,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
      <div className="mx-auto w-full max-w-6xl">
        <Skeleton className="h-3 w-32" />
        <div className="mt-6 space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-2/3" />
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-72 w-full rounded-2xl" />
        </div>
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
            className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-6")}
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
  const isPending = booking.status === "pending";

  const meta = [
    { icon: CalendarDays, label: "Event date", value: formatDate(booking.eventDate) },
    { icon: MapPin, label: "Event location", value: booking.eventLocation },
    { icon: MessageSquare, label: "Requested on", value: formatDate(booking.createdAt) },
    {
      icon: CalendarDays,
      label: "Last update",
      value: formatDateTime(booking.updatedAt ?? booking.createdAt),
    },
  ];

  const timeline = [
    {
      label: "Request sent",
      detail: formatDate(booking.createdAt),
      state: "done" as const,
    },
    {
      label:
        booking.status === "accepted"
          ? "Accepted by vendor"
          : booking.status === "rejected"
            ? "Declined by vendor"
            : booking.status === "cancelled"
              ? "Withdrawn by you"
              : "Awaiting vendor reply",
      detail:
        booking.status === "pending"
          ? "Most vendors reply within two days."
          : formatDateTime(booking.updatedAt ?? booking.createdAt),
      state:
        booking.status === "pending"
          ? ("current" as const)
          : booking.status === "rejected" || booking.status === "cancelled"
            ? ("stopped" as const)
            : ("done" as const),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link
        href="/dashboard/customer/bookings"
        className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        My bookings
      </Link>

      <header className="mt-5 flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow text-primary">Request</p>
          <h1 className="mt-3 truncate font-heading text-[1.9rem] leading-tight tracking-tight sm:text-[2.4rem]">
            {service?.serviceName ?? "Service removed"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {vendorName}
            {service ? (
              <>
                <span className="mx-1.5 text-muted-foreground/50">·</span>
                {formatCurrency(service.price)} starting
              </>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <StatusBadge status={booking.status} />
          {isPending ? (
            <Button
              variant="outline"
              className="h-10 gap-1.5 rounded-full px-5 text-destructive hover:text-destructive"
              onClick={() => setShowCancel(true)}
            >
              <XCircle className="size-4" />
              Cancel request
            </Button>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
            <h2 className="eyebrow text-muted-foreground">Progress</h2>
            <ol className="mt-5 space-y-0">
              {timeline.map((step, index) => (
                <li key={step.label} className="relative flex gap-4 pb-5 last:pb-0">
                  {index < timeline.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[0.6875rem] top-6 h-full w-px bg-border"
                    />
                  ) : null}
                  <span
                    className={cn(
                      "relative z-10 grid size-6 shrink-0 place-items-center rounded-full border",
                      step.state === "done" && "border-sage/60 bg-sage/15 text-[#4f6b52]",
                      step.state === "current" && "border-[#c9a675]/60 bg-[#c9a675]/15 text-[#8a6c3a]",
                      step.state === "stopped" && "border-border bg-muted text-muted-foreground"
                    )}
                  >
                    {step.state === "done" ? (
                      <Check className="size-3" strokeWidth={2.5} />
                    ) : step.state === "stopped" ? (
                      <X className="size-3" strokeWidth={2.5} />
                    ) : (
                      <span className="size-1.5 rounded-full bg-current" />
                    )}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
            <h2 className="eyebrow text-muted-foreground">The details</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {meta.map((entry) => (
                <div key={entry.label} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                    <entry.icon className="size-3.5" strokeWidth={1.6} />
                  </span>
                  <div className="min-w-0">
                    <dt className="text-[0.6rem] tracking-[0.14em] text-muted-foreground uppercase">
                      {entry.label}
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-foreground">{entry.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
            <h2 className="eyebrow text-muted-foreground">Your message</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/85">
              {booking.message}
            </p>
          </section>
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="glass-strong overflow-hidden rounded-2xl">
            {service?.images?.[0] ? (
              <div className="relative aspect-16/10 w-full bg-muted">
                <Image
                  src={service.images[0]}
                  alt={service.serviceName ?? "Service"}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="p-6">
              <p className="eyebrow text-muted-foreground">Starting price</p>
              <p className="mt-2 font-heading text-[2.2rem] leading-none tracking-tight text-primary">
                {service ? formatCurrency(service.price) : "—"}
              </p>
              <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                Agreed directly with {vendorName}. EverAfter never charges couples a booking fee.
              </p>

              {service ? (
                <Link
                  href={`/services/${service._id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "mt-5 h-11 w-full gap-1.5 rounded-full"
                  )}
                >
                  View service
                  <ArrowUpRight className="size-3.5" />
                </Link>
              ) : null}
            </div>

            <div className="flex items-start gap-3 border-t border-border/70 p-6">
              <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background font-heading text-sm text-primary">
                {vendorName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Your vendor
                </p>
                <p className="mt-1 truncate font-medium text-foreground">{vendorName}</p>
                {booking.vendor?.name && booking.vendor.businessName ? (
                  <p className="truncate text-xs text-muted-foreground">{booking.vendor.name}</p>
                ) : null}
              </div>
            </div>
          </div>

          {isPending ? (
            <p className="px-2 text-xs leading-relaxed text-muted-foreground">
              Still deciding? You can withdraw this request until the vendor replies.
            </p>
          ) : null}
        </aside>
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
