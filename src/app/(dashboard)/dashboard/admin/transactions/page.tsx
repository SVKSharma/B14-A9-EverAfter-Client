import type { Metadata } from "next";
import { AdminTransactionList } from "@/components/admin/admin-transaction-list";
import { PageHeader } from "@/components/shared/page-header";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { Transaction } from "@/types";

export const metadata: Metadata = { title: "Transactions" };

export default async function AdminTransactionsPage() {
  const result = await serverApiFetchMeta<Transaction[]>("/admin/transactions?limit=50");
  const transactions = result?.data ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Admin dashboard", href: "/dashboard/admin" },
          { label: "Transactions" },
        ]}
        eyebrow="Payments"
        title="Transactions"
        description="Every Premium payment, written by the Stripe webhook. This view is read-only."
      />

      <AdminTransactionList
        initialTransactions={transactions}
        initialTotal={(result?.meta?.total as number | undefined) ?? transactions.length}
      />
    </div>
  );
}
