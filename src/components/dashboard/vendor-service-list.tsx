"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { apiFetch, apiFetchPage, getErrorMessage } from "@/lib/api";
import { getCategoryLabel, FREE_SERVICE_LIMIT } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

export interface Quota {
  plan: "free" | "premium";
  limit: number | null;
  used: number;
  remaining: number | null;
}

interface VendorServiceListProps {
  initialServices: Service[];
  initialQuota: Quota | null;
}

export function VendorServiceList({ initialServices, initialQuota }: VendorServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [quota, setQuota] = useState(initialQuota);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  const reload = async () => {
    try {
      const page = await apiFetchPage<Service[]>("/vendor/services");
      setServices(page.data);
      setQuota((page.meta as unknown as { quota?: Quota } | undefined)?.quota ?? null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const toggleAvailability = async (service: Service) => {
    setBusyId(service._id);
    try {
      await apiFetch(`/vendor/services/${service._id}/availability`, {
        method: "PATCH",
        body: { availability: !service.availability },
      });
      setServices((current) =>
        current.map((item) =>
          item._id === service._id ? { ...item, availability: !item.availability } : item
        )
      );
      toast.success(service.availability ? "Service marked unavailable" : "Service is available again");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete._id;
    setBusyId(id);
    try {
      await apiFetch(`/vendor/services/${id}`, { method: "DELETE" });
      setServices((current) => current.filter((item) => item._id !== id));
      toast.success("Service deleted");
      setPendingDelete(null);
      void reload();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const atLimit = quota ? quota.remaining === 0 : false;
  const limit = quota?.limit ?? FREE_SERVICE_LIMIT;
  const used = quota?.used ?? services.length;
  const isPremium = quota?.plan === "premium";

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow text-primary">Listings</p>
          <h1 className="mt-3 font-heading text-[1.9rem] leading-tight tracking-tight">
            My services
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isPremium
              ? "Premium plan — unlimited services."
              : `Free plan: ${used} of ${limit} used.`}
          </p>
        </div>

        {atLimit ? (
          <Link
            href="/dashboard/vendor/subscription"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 rounded-full px-5")}
          >
            Upgrade for more
          </Link>
        ) : (
          <Link
            href="/dashboard/vendor/services/new"
            className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-5")}
          >
            <Plus className="size-4" />
            Add service
          </Link>
        )}
      </header>

      {!isPremium ? (
        <div>
          <div className="flex items-center justify-between gap-4 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
            <span>Service slots</span>
            <span>
              {used} / {limit}
            </span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-beige">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                atLimit ? "bg-gold" : "bg-primary"
              )}
              style={{ width: `${Math.min(100, (used / limit) * 100)}%` }}
            />
          </div>
          {atLimit ? (
            <p className="mt-2 text-xs text-muted-foreground">
              You have used every slot. Remove a service or{" "}
              <Link href="/dashboard/vendor/subscription" className="text-primary hover:underline">
                upgrade to premium
              </Link>
              .
            </p>
          ) : null}
        </div>
      ) : null}

      {services.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No services yet"
          description="Add your first service so couples can find and book you."
          action={
            <Link
              href="/dashboard/vendor/services/new"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-5")}
            >
              Add your first service
            </Link>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
          {services.map((service, index) => (
            <article
              key={service._id}
              className={cn(
                "flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5",
                index > 0 && "border-t border-border/70"
              )}
            >
              <div className="relative aspect-4/3 w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:size-20 sm:aspect-auto">
                {service.images[0] ? (
                  <Image
                    src={service.images[0]}
                    alt={service.serviceName}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-heading text-lg leading-tight tracking-tight">
                    {service.serviceName}
                  </h2>
                  <StatusBadge status={service.status} />
                  {!service.availability ? (
                    <span className="rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-[0.62rem] tracking-[0.1em] text-muted-foreground uppercase">
                      Hidden
                    </span>
                  ) : null}
                </div>

                <p className="mt-1.5 text-xs text-muted-foreground">
                  {getCategoryLabel(service.category)} · {formatCurrency(service.price)} ·{" "}
                  {service.location}
                </p>

                {service.status === "rejected" && service.rejectionReason ? (
                  <p className="mt-1.5 text-xs leading-relaxed text-destructive">
                    {service.rejectionReason}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5 sm:shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full"
                  aria-label={service.availability ? "Mark unavailable" : "Mark available"}
                  onClick={() => void toggleAvailability(service)}
                  disabled={busyId === service._id}
                >
                  {busyId === service._id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : service.availability ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
                <Link
                  href={`/dashboard/vendor/services/${service._id}/edit`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "size-9 rounded-full"
                  )}
                  aria-label={`Edit ${service.serviceName}`}
                >
                  <Pencil className="size-4" />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 rounded-full text-destructive hover:bg-destructive/[0.07] hover:text-destructive"
                  aria-label={`Delete ${service.serviceName}`}
                  onClick={() => setPendingDelete(service)}
                  disabled={busyId === service._id}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => (!open ? setPendingDelete(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.serviceName} will be removed permanently. Existing bookings keep their
              records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(busyId)}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDelete();
              }}
              disabled={Boolean(busyId)}
            >
              {busyId ? <Loader2 className="size-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
