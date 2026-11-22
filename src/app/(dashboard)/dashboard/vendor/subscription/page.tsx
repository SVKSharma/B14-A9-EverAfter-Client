import type { Metadata } from "next";
import { SubscriptionPlans, type SubscriptionStatus } from "@/components/subscriptions/subscription-plans";
import { PageHeader } from "@/components/shared/page-header";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = { title: "Subscription" };

export default async function VendorSubscriptionPage() {
  const status = await serverApiFetch<SubscriptionStatus>("/subscriptions/status");
  // Stamped once on the server so relative day counts are computed from a
  // stable value instead of calling Date.now() during render.
  const serverNow = new Date().toISOString();

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Vendor dashboard", href: "/dashboard/vendor" },
          { label: "Subscription" },
        ]}
        eyebrow="Plans"
        title="Subscription"
        description="Free vendors can publish three services. Premium removes the limit and features your listings."
      />

      {status ? (
        <SubscriptionPlans status={status} serverNow={serverNow} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border px-6 py-14 text-center text-sm text-muted-foreground">
          We could not load your plan right now. Please refresh the page.
        </p>
      )}
    </div>
  );
}
