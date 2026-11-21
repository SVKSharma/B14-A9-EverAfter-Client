"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiFetchPage, getErrorMessage } from "@/lib/api";
import { formatDateTime } from "@/lib/format";
import type { Transaction } from "@/types";

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

export function AdminTransactionList({
  initialTransactions,
  initialTotal,
}: AdminTransactionListProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [total, setTotal] = useState(initialTotal);
  const [status, setStatus] = useState("all");
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
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
          <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Filter by status">
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

      {transactions.length === 0 && !isLoading ? (
        <EmptyState
          icon={Receipt}
          title="No payments yet"
          description="Premium subscriptions confirmed by Stripe will appear here, read-only."
        />
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <Card key={transaction._id} className="border-border/80">
              <CardContent className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium capitalize">{transaction.plan} plan</p>
                    <StatusBadge status={transaction.status} />
                  </div>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {transaction.vendor?.businessName ||
                      transaction.vendor?.name ||
                      transaction.vendorId}
                    {transaction.vendor?.email ? ` · ${transaction.vendor.email}` : ""}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                    {transaction.stripeSessionId}
                  </p>
                </div>

                <div className="shrink-0 text-left sm:text-right">
                  <p className="font-medium">{formatAmount(transaction.amount, transaction.currency)}</p>
                  <p className="text-xs text-muted-foreground">{formatDateTime(transaction.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
