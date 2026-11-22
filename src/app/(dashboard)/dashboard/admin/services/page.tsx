import type { Metadata } from "next";
import { AdminServiceList } from "@/components/admin/admin-service-list";
import { PageHeader } from "@/components/shared/page-header";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { Service } from "@/types";

export const metadata: Metadata = { title: "Moderate Services" };

export default async function AdminServicesPage() {
  const result = await serverApiFetchMeta<Service[]>("/admin/services?limit=50");
  const services = result?.data ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Admin dashboard", href: "/dashboard/admin" },
          { label: "Services" },
        ]}
        eyebrow="Moderation"
        title="Moderate services"
        description="New listings arrive as pending. Approve to publish, reject with a reason, or delete inappropriate content."
      />

      <AdminServiceList
        initialServices={services}
        initialTotal={(result?.meta?.total as number | undefined) ?? services.length}
      />
    </div>
  );
}
