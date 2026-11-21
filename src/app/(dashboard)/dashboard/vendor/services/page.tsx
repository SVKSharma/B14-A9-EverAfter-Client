import type { Metadata } from "next";
import { VendorServiceList, type Quota } from "@/components/dashboard/vendor-service-list";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { Service } from "@/types";

export const metadata: Metadata = { title: "My Services" };

export default async function VendorServicesPage() {
  // Rendered on the server with the caller's cookie so the list is present on
  // first paint and never flashes an empty state.
  const result = await serverApiFetchMeta<Service[]>("/vendor/services");
  const quota = (result?.meta?.quota as Quota | undefined) ?? null;

  return <VendorServiceList initialServices={result?.data ?? []} initialQuota={quota} />;
}
