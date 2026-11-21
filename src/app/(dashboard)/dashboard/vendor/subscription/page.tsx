import type { Metadata } from "next";
import Link from "next/link";
import { SubscriptionPlans, type SubscriptionStatus } from "@/components/subscriptions/subscription-plans";
import { serverApiFetch } from "@/lib/server-api";

export const metadata: Metadata = { title: "Subscription" };

export default async function VendorSubscriptionPage() {
  const status = await serverApiFetch<SubscriptionStatus>("/subscriptions/status");

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/vendor" className="hover:text-foreground">
          Vendor dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Subscription</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Plans</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Free vendors can publish three services. Premium removes the limit and features your
          listings.
        </p>
      </div>

      {status ? (
        <SubscriptionPlans status={status} />
      ) : (
        <p className="text-sm text-muted-foreground">
          We could not load your plan right now. Please refresh the page.
        </p>
      )}
    </div>
  );
}
