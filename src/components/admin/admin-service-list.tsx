"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Check, Clock3, Loader2, Search, ShieldCheck, Store, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, apiFetchPage, getErrorMessage } from "@/lib/api";
import { CATEGORIES, getCategoryLabel } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

interface AdminServiceListProps {
  initialServices: Service[];
  initialTotal: number;
}

type Filter = "all" | "pending" | "approved" | "rejected";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "In review" },
  { value: "approved", label: "Live" },
  { value: "rejected", label: "Rejected" },
];

export function AdminServiceList({ initialServices, initialTotal }: AdminServiceListProps) {
  const [services, setServices] = useState(initialServices);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Filter>("all");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [rejecting, setRejecting] = useState<Service | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Service | null>(null);

  const counts = useMemo(
    () => ({
      pending: services.filter((item) => item.status === "pending").length,
      approved: services.filter((item) => item.status === "approved").length,
      rejected: services.filter((item) => item.status === "rejected").length,
    }),
    [services]
  );

  const load = async (
    next: { search?: string; status?: Filter; category?: string } = {}
  ) => {
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

  const isFiltered = search.trim().length > 0 || status !== "all" || category !== "all";

  return (
    <div className="space-y-6">
      <StatStrip className="xl:grid-cols-3">
        <StatCard
          icon={Clock3}
          label="In review"
          value={counts.pending}
          hint={counts.pending > 0 ? "Waiting on a decision" : "Queue is clear"}
          tone={counts.pending > 0 ? "warning" : "success"}
        />
        <StatCard
          icon={ShieldCheck}
          label="Live"
          value={counts.approved}
          hint="Visible in the catalogue"
          tone="success"
        />
        <StatCard
          icon={Store}
          label="Loaded"
          value={total}
          hint={`${counts.rejected} rejected on this page`}
          tone="primary"
        />
      </StatStrip>

      <div className="flex flex-col gap-3">
        <form
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search service name, description or location"
            aria-label="Search services"
            className="h-11 w-full rounded-full border border-input bg-card/80 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/15"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setStatus(option.value);
                void load({ status: option.value });
              }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase transition-colors",
                status === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
              {option.value === "pending" && counts.pending > 0 ? (
                <span className="ml-1.5 tabular-nums opacity-70">{counts.pending}</span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => {
              setCategory("all");
              void load({ category: "all" });
            }}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-[0.65rem] tracking-[0.1em] uppercase transition-colors",
              category === "all"
                ? "border-foreground/25 bg-foreground/[0.06] text-foreground"
                : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Every category
          </button>
          {CATEGORIES.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setCategory(item.value);
                void load({ category: item.value });
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1 text-[0.65rem] tracking-[0.1em] uppercase transition-colors",
                category === item.value
                  ? "border-foreground/25 bg-foreground/[0.06] text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {item.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Loading listings…" : `${total} listing${total === 1 ? "" : "s"}`}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("all");
              setCategory("all");
              void load({ search: "", status: "all", category: "all" });
            }}
            className="text-[0.7rem] tracking-[0.12em] text-primary uppercase underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {services.length === 0 && !isLoading ? (
        <EmptyState
          icon={Search}
          title="No listings match"
          description="Try a different search term, status or category."
        />
      ) : (
        <div className="space-y-3">
          {services.map((service) => {
            const isPending = service.status === "pending";

            return (
              <article
                key={service._id}
                className={cn(
                  "overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-xl transition-colors",
                  isPending ? "border-primary/25" : "border-border/70"
                )}
              >
                <div className="flex flex-col gap-4 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted ring-1 ring-border/60">
                      {service.images?.[0] ? (
                        <Image
                          src={service.images[0]}
                          alt={service.serviceName}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="grid h-full place-items-center text-[0.55rem] tracking-[0.1em] text-muted-foreground uppercase">
                          No photo
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-heading text-lg leading-tight tracking-tight text-foreground">
                          {service.serviceName}
                        </h2>
                        <StatusBadge status={service.status} />
                        {!service.availability ? (
                          <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2.5 text-[0.62rem] tracking-[0.1em] text-muted-foreground uppercase">
                            Unavailable
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        {service.vendor?.businessName || service.vendor?.name || "Unknown vendor"}
                        {service.vendor?.email ? ` · ${service.vendor.email}` : ""}
                      </p>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                        <span>{getCategoryLabel(service.category)}</span>
                        <span className="text-foreground">{formatCurrency(service.price)}</span>
                        <span>{service.location}</span>
                        <span>Listed {formatDate(service.createdAt)}</span>
                      </div>

                      {service.status === "rejected" && service.rejectionReason ? (
                        <p className="mt-2.5 flex items-start gap-1.5 rounded-lg border border-destructive/20 bg-destructive/[0.05] px-3 py-2 text-xs leading-relaxed text-destructive">
                          <X className="mt-0.5 size-3 shrink-0" strokeWidth={2.2} />
                          {service.rejectionReason}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 border-t border-border/60 pt-3.5">
                    {service.status !== "approved" ? (
                      <Button
                        size="sm"
                        className="h-9 gap-1.5 rounded-full px-4"
                        onClick={() => void approve(service)}
                        disabled={busyId === service._id}
                      >
                        {busyId === service._id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Check className="size-3.5" />
                        )}
                        Approve
                      </Button>
                    ) : null}
                    {service.status !== "rejected" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 gap-1.5 rounded-full px-4"
                        onClick={() => {
                          setRejecting(service);
                          setRejectionReason("");
                        }}
                        disabled={busyId === service._id}
                      >
                        <X className="size-3.5" />
                        Reject
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto h-9 gap-1.5 rounded-full px-4 text-destructive hover:text-destructive"
                      onClick={() => setPendingDelete(service)}
                      disabled={busyId === service._id}
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
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
              className="rounded-full px-5"
              onClick={() => {
                setRejecting(null);
                setRejectionReason("");
              }}
              disabled={Boolean(busyId)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full px-5"
              onClick={() => void reject()}
              disabled={Boolean(busyId)}
            >
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
              variant="destructive"
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
