"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/types";

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  expiresAt: string | null;
  price: { amount: number; currency: string; days: number };
  latestTransaction: {
    id: string;
    status: "pending" | "success" | "failed" | "expired";
    amount: number;
    currency: string;
    createdAt: string;
  } | null;
}

const FREE_FEATURES = [
  "Up to 3 active services",
  "Basic vendor dashboard",
  "Booking request management",
];

const PREMIUM_FEATURES = [
  "Unlimited active services",
  "Premium vendor badge on every card",
  "Featured placement ahead of free vendors",
  "Everything in the Free plan",
];

export function SubscriptionPlans({ status }: { status: SubscriptionStatus }) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isPremium = status.plan === "premium";
  const price = formatCurrency(status.price.amount / 100, status.price.currency);

  const upgrade = async () => {
    setIsRedirecting(true);

    try {
      const data = await apiFetch<{ url: string }>("/subscriptions/checkout", {
        method: "POST",
      });
      // Hosted Checkout: the plan changes only when Stripe's webhook arrives.
      window.location.assign(data.url);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsRedirecting(false);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <Card
        className={cn(
          "overflow-hidden border-border/80",
          isPremium && "border-primary/30 bg-primary/5"
        )}
      >
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Current plan
            </p>
            <p className="mt-1 flex items-center gap-2 font-heading text-2xl font-semibold">
              <Crown className={cn("size-5", isPremium ? "text-gold" : "text-muted-foreground")} />
              {isPremium ? "Premium" : "Free"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPremium && status.expiresAt
                ? `Active until ${formatDateTime(status.expiresAt)}. You can renew once it expires.`
                : `Premium is a one-time ${price} payment for ${status.price.days} days.`}
            </p>
          </div>

          {isPremium ? (
            <p className="text-xs text-muted-foreground sm:max-w-48 sm:text-right">
              Renew after it expires to buy another {status.price.days} days.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="border-border/80">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Free</CardTitle>
            <CardDescription>Everything you need to get your first bookings.</CardDescription>
            <p className="pt-2 font-heading text-3xl font-semibold">
              $0
              <span className="text-sm font-normal text-muted-foreground"> / forever</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button disabled variant="outline" className="mt-6 w-full">
              {isPremium ? "Included in Premium" : "Your current plan"}
            </Button>
          </CardContent>
        </Card>

        <Card className="relative border-primary/40 bg-linear-to-b from-primary/5 to-transparent shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="font-heading text-xl">Premium</CardTitle>
              <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold text-plum">
                Best value
              </span>
            </div>
            <CardDescription>Stand out and list as many services as you like.</CardDescription>
            <p className="pt-2 font-heading text-3xl font-semibold">
              {price}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / {status.price.days} days
              </span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              onClick={() => void upgrade()}
              disabled={isRedirecting || isPremium}
              size="lg"
              className="mt-6 w-full"
            >
              {isRedirecting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Crown className="size-4" />
              )}
              {isPremium ? "Premium is active" : "Upgrade to Premium"}
            </Button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Secure checkout on Stripe. Activated only after payment is confirmed.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="font-heading text-lg">Latest payment</CardTitle>
        </CardHeader>
        <CardContent>
          {status.latestTransaction ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <StatusBadge status={status.latestTransaction.status} />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {formatCurrency(
                    status.latestTransaction.amount / 100,
                    status.latestTransaction.currency
                  )}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium">{formatDateTime(status.latestTransaction.createdAt)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No payments yet. Your first upgrade will appear here once Stripe confirms it.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
