import type { Metadata } from "next";
import Link from "next/link";
import { AdminServiceList } from "@/components/admin/admin-service-list";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { Service } from "@/types";

export const metadata: Metadata = { title: "Moderate Services" };

export default async function AdminServicesPage() {
  const result = await serverApiFetchMeta<Service[]>("/admin/services?limit=50");

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/admin" className="hover:text-foreground">
          Admin dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Services</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Moderate services</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New listings arrive as pending. Approve to publish, reject with a reason, or delete
          inappropriate content.
        </p>
      </div>

      <AdminServiceList
        initialServices={result?.data ?? []}
        initialTotal={(result?.meta?.total as number | undefined) ?? result?.data.length ?? 0}
      />
    </div>
  );
}
