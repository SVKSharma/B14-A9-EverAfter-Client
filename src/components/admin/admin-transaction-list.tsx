"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CreditCard, Loader2, Receipt, ShieldCheck, Wallet } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { apiFetchPage, getErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/types";

interface AdminTransactionListProps {
  initialTransactions: Transaction[];
  initialTotal: number;
}

const STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "expired", label: "Expired" },
];

function formatAmount(amount: number, currency: string) {
  // Stripe amounts are stored in the smallest currency unit (cents).
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: (currency || "usd").toUpperCase(),
  }).format(amount / 100);
}

function shortReference(value: string) {
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}…${value.slice(-6)}`;
}

export function AdminTransactionList({
  initialTransactions,
  initialTotal,
}: AdminTransactionListProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [total, setTotal] = useState(initialTotal);
  const [status, setStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  const load = async (nextStatus: string) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (nextStatus !== "all") params.set("status", nextStatus);

      const page = await apiFetchPage<Transaction[]>(`/admin/transactions?${params.toString()}`);
      setTransactions(page.data);
      setTotal(page.meta?.total ?? page.data.length);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const totals = useMemo(() => {
    const confirmed = transactions.filter((item) => item.status === "success");
    const settled = confirmed.reduce((sum, item) => sum + item.amount, 0);
    const currency = confirmed[0]?.currency ?? "usd";
    const awaiting = transactions.filter((item) => item.status === "pending").length;

    return {
      settled: formatAmount(settled, currency),
      confirmed: confirmed.length,
      awaiting,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      <StatStrip className="xl:grid-cols-3">
        <StatCard
          icon={Wallet}
          label="Collected"
          value={totals.settled}
          hint={`${totals.confirmed} confirmed payment${totals.confirmed === 1 ? "" : "s"}`}
          tone="success"
        />
        <StatCard
          icon={Loader2}
          label="Awaiting"
          value={totals.awaiting}
          hint={totals.awaiting > 0 ? "Not yet confirmed" : "Nothing in flight"}
          tone={totals.awaiting > 0 ? "warning" : "default"}
        />
        <StatCard
          icon={CreditCard}
          label="Records"
          value={total}
          hint="Written by Stripe only"
          tone="primary"
        />
      </StatStrip>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading payments…" : `${total} payment${total === 1 ? "" : "s"}`}
          </p>

          <Select
            value={status}
            onValueChange={(value) => {
              const next = value ?? "all";
              setStatus(next);
              void load(next);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-full px-4 sm:w-44" aria-label="Filter by status">
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
        </div>

        <p className="flex items-start gap-2 rounded-2xl border border-border/70 bg-card/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground backdrop-blur-xl">
          <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-[#4f6b52]" strokeWidth={1.8} />
          Read-only. A payment only becomes <span className="font-medium text-foreground">success</span>{" "}
          when Stripe confirms it through the verified webhook.
        </p>
      </div>

      {transactions.length === 0 && !isLoading ? (
        <EmptyState
          icon={Receipt}
          title={status === "all" ? "No payments yet" : "No payments in this state"}
          description={
            status === "all"
              ? "Premium subscriptions confirmed by Stripe will appear here, read-only."
              : "Try a different status filter."
          }
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
          <ul className="divide-y divide-border/70">
            {transactions.map((transaction) => (
              <li
                key={transaction._id}
                className={cn(
                  "flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-background/40 sm:px-5 lg:flex-row lg:items-center lg:justify-between",
                  transaction.status === "pending" && "bg-gold/[0.03]"
                )}
              >
                <div className="flex min-w-0 items-start gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl border border-border/70 bg-background/70">
                    <Receipt
                      className={cn(
                        "size-4",
                        transaction.status === "success" ? "text-[#4f6b52]" : "text-muted-foreground"
                      )}
                      strokeWidth={1.6}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium capitalize text-foreground">
                        {transaction.plan} plan
                      </p>
                      <StatusBadge status={transaction.status as TransactionStatus} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {transaction.vendor?.businessName ||
                        transaction.vendor?.name ||
                        transaction.vendorId}
                      {transaction.vendor?.email ? ` · ${transaction.vendor.email}` : ""}
                    </p>
                    <p
                      className="mt-1 truncate font-mono text-[0.65rem] text-muted-foreground/80"
                      title={transaction.stripeSessionId}
                    >
                      {shortReference(transaction.stripeSessionId)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pl-12.5 sm:pl-13 lg:shrink-0 lg:flex-col lg:items-end lg:gap-1 lg:pl-0">
                  <p className="font-heading text-lg leading-none tracking-tight text-foreground">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    {formatDateTime(transaction.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
