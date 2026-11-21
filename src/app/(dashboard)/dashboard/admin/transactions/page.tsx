import type { Metadata } from "next";
import Link from "next/link";
import { AdminTransactionList } from "@/components/admin/admin-transaction-list";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { Transaction } from "@/types";

export const metadata: Metadata = { title: "Transactions" };

export default async function AdminTransactionsPage() {
  const result = await serverApiFetchMeta<Transaction[]>("/admin/transactions?limit=50");

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/admin" className="hover:text-foreground">
          Admin dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Transactions</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Transactions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every Premium payment, written by the Stripe webhook. This view is read-only.
        </p>
      </div>

      <AdminTransactionList
        initialTransactions={result?.data ?? []}
        initialTotal={(result?.meta?.total as number | undefined) ?? result?.data.length ?? 0}
      />
    </div>
  );
}
