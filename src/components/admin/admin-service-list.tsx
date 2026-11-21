"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Check, Loader2, Search, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CATEGORIES, getCategoryLabel, SERVICE_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Service } from "@/types";

interface AdminServiceListProps {
  initialServices: Service[];
  initialTotal: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  ...SERVICE_STATUSES.map((status) => ({
    value: status,
    label: status.charAt(0).toUpperCase() + status.slice(1),
  })),
];

export function AdminServiceList({ initialServices, initialTotal }: AdminServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [rejecting, setRejecting] = useState<Service | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  const load = async (next: { search?: string; status?: string; category?: string } = {}) => {
    const nextSearch = next.search ?? search;
    const nextStatus = next.status ?? status;
    const nextCategory = next.category ?? category;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextStatus !== "all") params.set("status", nextStatus);
      if (nextCategory !== "all") params.set("category", nextCategory);

      const page = await apiFetchPage<Service[]>(`/admin/services?${params.toString()}`);
      setServices(page.data);
      setTotal(page.meta?.total ?? page.data.length);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const approve = async (service: Service) => {
    setBusyId(service._id);

    try {
      await apiFetch(`/admin/services/${service._id}/status`, {
        method: "PATCH",
        body: { status: "approved" },
      });
      setServices((current) =>
        current.map((item) =>
          item._id === service._id
            ? { ...item, status: "approved", rejectionReason: null }
            : item
        )
      );
      toast.success(`${service.serviceName} approved and published`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const reject = async () => {
    if (!rejecting) return;
    if (rejectionReason.trim().length < 5) {
      toast.error("Add a short reason so the vendor knows what to fix.");
      return;
    }

    setBusyId(rejecting._id);

    try {
      await apiFetch(`/admin/services/${rejecting._id}/status`, {
        method: "PATCH",
        body: { status: "rejected", rejectionReason: rejectionReason.trim() },
      });
      setServices((current) =>
        current.map((item) =>
          item._id === rejecting._id
            ? { ...item, status: "rejected", rejectionReason: rejectionReason.trim() }
            : item
        )
      );
      toast.success("Listing rejected. The vendor can edit and resubmit.");
      setRejecting(null);
      setRejectionReason("");
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
      await apiFetch(`/admin/services/${id}`, { method: "DELETE" });
      setServices((current) => current.filter((item) => item._id !== id));
      setTotal((current) => Math.max(current - 1, 0));
      toast.success("Service deleted");
      setPendingDelete(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service name, description or location"
            className="h-10 pl-9"
            aria-label="Search services"
          />
        </form>

        <Select
          value={status}
          onValueChange={(value) => {
            const next = value ?? "all";
            setStatus(next);
            void load({ status: next });
          }}
        >
          <SelectTrigger className="h-10 w-full sm:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={category}
          onValueChange={(value) => {
            const next = value ?? "all";
            setCategory(next);
            void load({ category: next });
          }}
        >
          <SelectTrigger className="h-10 w-full sm:w-48" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.shortLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        {isLoading ? "Loading listings…" : `${total} listing${total === 1 ? "" : "s"}`}
      </p>

      {services.length === 0 && !isLoading ? (
        <EmptyState
          icon={Search}
          title="No listings match"
          description="Try a different search term, status or category."
        />
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <Card key={service._id} className="border-border/80">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                  {service.images?.[0] ? (
                    <Image
                      src={service.images[0]}
                      alt={service.serviceName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{service.serviceName}</p>
                    <StatusBadge status={service.status} />
                    {!service.availability ? (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        Unavailable
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {service.vendor?.businessName || service.vendor?.name || "Unknown vendor"}
                    {service.vendor?.email ? ` · ${service.vendor.email}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {getCategoryLabel(service.category)} · {formatCurrency(service.price)} ·{" "}
                    {service.location} · Listed {formatDate(service.createdAt)}
                  </p>
                  {service.status === "rejected" && service.rejectionReason ? (
                    <p className="mt-1.5 text-xs text-destructive">{service.rejectionReason}</p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  {service.status !== "approved" ? (
                    <Button
                      size="sm"
                      className="h-9 gap-1.5"
                      onClick={() => void approve(service)}
                      disabled={busyId === service._id}
                    >
                      {busyId === service._id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve
                    </Button>
                  ) : null}
                  {service.status !== "rejected" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1.5"
                      onClick={() => {
                        setRejecting(service);
                        setRejectionReason("");
                      }}
                      disabled={busyId === service._id}
                    >
                      <X className="size-4" />
                      Reject
                    </Button>
                  ) : null}
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

      <Dialog
        open={Boolean(rejecting)}
        onOpenChange={(open) => {
          if (!open) {
            setRejecting(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject this listing?</DialogTitle>
            <DialogDescription>
              {rejecting?.serviceName} will be hidden from the catalogue. The vendor sees your
              reason and can edit the listing to resubmit it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label htmlFor="rejectionReason" className="text-sm font-medium">
              Reason for rejection
            </label>
            <Textarea
              id="rejectionReason"
              rows={4}
              maxLength={500}
              value={rejectionReason}
              onChange={(event) => setRejectionReason(event.target.value)}
              placeholder="e.g. Photos do not match the service description."
            />
            <p className="text-xs text-muted-foreground">{rejectionReason.length} / 500 characters</p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejecting(null);
                setRejectionReason("");
              }}
              disabled={Boolean(busyId)}
            >
              Cancel
            </Button>
            <Button onClick={() => void reject()} disabled={Boolean(busyId)}>
              {busyId ? <Loader2 className="size-4 animate-spin" /> : null}
              Reject listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => (!open ? setPendingDelete(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.serviceName} will be deleted permanently. Existing bookings keep their
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
