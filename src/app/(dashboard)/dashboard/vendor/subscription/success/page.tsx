import type { Metadata } from "next";
import { PaymentSuccess } from "@/components/subscriptions/payment-success";

export const metadata: Metadata = { title: "Payment Successful" };

export default async function SubscriptionSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string | string[] }>;
}) {
  const params = await searchParams;
  const sessionId = Array.isArray(params.session_id)
    ? (params.session_id[0] ?? null)
    : (params.session_id ?? null);

  return (
    <div className="py-6">
      <PaymentSuccess sessionId={sessionId} />
    </div>
  );
}
