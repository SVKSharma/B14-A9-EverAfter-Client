"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  rejected: "bg-destructive/10 text-destructive",
};

export function VendorServiceList({ initialServices, initialQuota }: VendorServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [quota, setQuota] = useState(initialQuota);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  // Re-reads the list so quota and ordering stay authoritative after a delete.
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">My services</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {quota?.plan === "premium"
              ? "Premium plan — unlimited services."
              : `Free plan: ${quota?.used ?? 0} of ${FREE_SERVICE_LIMIT} used.`}
          </p>
        </div>

        {atLimit ? (
          <span className="text-xs text-muted-foreground">
            Remove a service or upgrade to add more.
          </span>
        ) : (
          <Link
            href="/dashboard/vendor/services/new"
            className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2")}
          >
            <Plus className="size-4" />
            Add service
          </Link>
        )}
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="No services yet"
          description="Add your first service so couples can find and book you."
          action={
            <Link href="/dashboard/vendor/services/new" className={cn(buttonVariants())}>
              Add your first service
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <Card key={service._id} className="overflow-hidden border-border/80">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
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
                    <h2 className="truncate font-medium">{service.serviceName}</h2>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                        STATUS_STYLES[service.status]
                      )}
                    >
                      {service.status}
                    </span>
                    {!service.availability ? <Badge variant="outline">Unavailable</Badge> : null}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {getCategoryLabel(service.category)} · {formatCurrency(service.price, "BDT")} ·{" "}
                    {service.location}
                  </p>
                  {service.status === "rejected" && service.rejectionReason ? (
                    <p className="mt-1.5 text-xs text-destructive">{service.rejectionReason}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9"
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
                    className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-9")}
                    aria-label={`Edit ${service.serviceName}`}
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-9 text-destructive hover:text-destructive"
                    aria-label={`Delete ${service.serviceName}`}
                    onClick={() => setPendingDelete(service)}
                    disabled={busyId === service._id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
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
