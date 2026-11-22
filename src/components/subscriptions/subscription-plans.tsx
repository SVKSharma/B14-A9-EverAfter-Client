"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Clock3, Crown, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    /** True when Stripe has the money but the webhook has not landed yet. */
    awaitingActivation?: boolean;
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

/** Poll interval while waiting for Stripe's webhook. */
const POLL_MS = 4000;
/** After the first burst, keep checking at a slower pace while the card is open. */
const SLOW_POLL_MS = 15000;
const FAST_POLLS = 15;

/**
 * How long an unfinished checkout blocks a second one. Stripe confirms a paid
 * session within seconds, so a pending row older than this is an abandoned
 * attempt and the vendor must be allowed to try again.
 */
const PENDING_LOCK_MS = 15 * 60 * 1000;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function SubscriptionPlans({
  status,
  serverNow,
}: {
  status: SubscriptionStatus;
  /** Render timestamp from the server, so day counts stay pure on the client. */
  serverNow: string;
}) {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Keyed by the current pending transaction, so a fresh checkout starts
  // unlocked without needing to reset anything.
  const [lockState, setLockState] = useState<{ key: string; expired: boolean }>({
    key: "",
    expired: false,
  });
  /** Bumped by "Check now" so the poll loop restarts without remounting. */
  const [pollNonce, setPollNonce] = useState(0);
  const [isCheckingNow, setIsCheckingNow] = useState(false);

  const isPremium = status.plan === "premium";
  const latest = status.latestTransaction;
  const checkoutPending = !isPremium && latest?.status === "pending";
  const checkoutExpired = !isPremium && latest?.status === "expired";
  const transactionKey = latest ? `${latest.id}:${latest.createdAt}` : "";

  /**
   * Stripe already has the money but the webhook never reached the server.
   * Waiting is pointless and retrying would charge again, so this is its own
   * state rather than part of the normal pending flow.
   */
  const awaitingActivation = checkoutPending && latest?.awaitingActivation === true;

  const lockExpired = lockState.key === transactionKey && lockState.expired;
  const isLocked = checkoutPending && !lockExpired;
  /** Either the row was swept to `expired`, or the local lock window ran out. */
  const abandoned = !isLocked && (checkoutExpired || lockExpired);
  const price = formatCurrency(status.price.amount / 100, status.price.currency);
  const daysLeft = status.expiresAt
    ? Math.max(
        0,
        Math.ceil(
          (new Date(status.expiresAt).getTime() - new Date(serverNow).getTime()) /
            (24 * 60 * 60 * 1000)
        )
      )
    : 0;

  // Release the lock when the pending window runs out, so a dropped webhook
  // cannot keep the vendor from ever trying again. A paid-but-unconfirmed
  // checkout is excluded: money has moved, so offering a retry would invite a
  // second charge.
  useEffect(() => {
    if (!checkoutPending || !latest || awaitingActivation) return;

    const remaining =
      new Date(latest.createdAt).getTime() + PENDING_LOCK_MS - new Date(serverNow).getTime();

    const timer = window.setTimeout(
      () => setLockState({ key: transactionKey, expired: true }),
      Math.max(0, remaining)
    );

    return () => window.clearTimeout(timer);
  }, [checkoutPending, latest, transactionKey, serverNow, awaitingActivation]);

  /**
   * Stripe's webhook is the only thing that can flip the plan, so re-read the
   * status on a timer instead of leaving the vendor staring at "pending" until
   * they think to refresh. The first burst is quick; after that it settles into
   * a slow background check that keeps running while the page is open.
   */
  useEffect(() => {
    if (!isLocked) return;

    let cancelled = false;

    const run = async () => {
      for (let poll = 0; !cancelled; poll += 1) {
        await delay(poll < FAST_POLLS ? POLL_MS : SLOW_POLL_MS);
        if (cancelled) return;

        try {
          const next = await apiFetch<SubscriptionStatus>("/subscriptions/status");
          if (cancelled) return;

          if (next.plan === "premium") {
            toast.success("Premium is active");
            router.refresh();
            return;
          }

          // The row settled without upgrading, so there is nothing to wait for.
          if (next.latestTransaction?.status !== "pending") {
            router.refresh();
            return;
          }
        } catch {
          // A transient failure should not kill the loop; the next tick retries.
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isLocked, transactionKey, pollNonce, router]);

  /** One immediate re-read, so the vendor is not forced to wait for a tick. */
  const checkNow = async () => {
    setIsCheckingNow(true);

    try {
      const next = await apiFetch<SubscriptionStatus>("/subscriptions/status");

      if (next.plan === "premium") {
        toast.success("Premium is active");
        router.refresh();
        return;
      }

      if (next.latestTransaction?.status !== "pending") {
        router.refresh();
        return;
      }

      toast.info("Still waiting for Stripe to confirm this payment.");
      setPollNonce((value) => value + 1);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsCheckingNow(false);
    }
  };

  const upgrade = async () => {
    // Belt and braces: the button is disabled, but never start a second
    // charge while one is still being confirmed.
    if (isLocked || isPremium || isRedirecting) return;

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

  const currentPlan = [
    {
      label: "Plan",
      value: (
        <span
          className={cn(
            "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[0.62rem] tracking-[0.1em] uppercase",
            isPremium
              ? "bg-gold text-white"
              : "border border-border bg-background text-muted-foreground"
          )}
        >
          {isPremium ? <Crown className="size-2.5" strokeWidth={2} /> : null}
          {isPremium ? "Premium" : "Free"}
        </span>
      ),
    },
    {
      label: isPremium ? "Renews in" : "Next payment",
      value: isPremium
        ? `${daysLeft} day${daysLeft === 1 ? "" : "s"}`
        : awaitingActivation
          ? "Paid — activation pending"
          : isLocked
            ? "Awaiting confirmation"
            : "None due",
    },
    {
      label: isPremium ? "Active until" : "Price",
      value: isPremium
        ? formatDateTime(status.expiresAt)
        : `${price} / ${status.price.days} days`,
    },
  ];

  const headline = isPremium
    ? "Premium is active"
    : awaitingActivation
      ? "Payment received"
      : isLocked
        ? "Confirming your payment"
        : "You are on the Free plan";

  const blurb = isPremium
    ? `Unlimited listings and featured placement. Your pass runs for ${daysLeft} more day${
        daysLeft === 1 ? "" : "s"
      }, until ${formatDateTime(status.expiresAt)}.`
    : awaitingActivation
      ? "Stripe has your payment, but the confirmation has not reached our server yet. Do not pay again — this page keeps checking and unlocks Premium as soon as it lands."
      : isLocked
        ? "Stripe has your checkout. Premium unlocks the moment the confirmation reaches our server — this page updates on its own, so you can leave it open."
        : `Publish up to three services and take booking requests at no cost. Premium unlocks unlimited listings for ${price}.`;

  const buttonLabel = isPremium
    ? "Premium is active"
    : awaitingActivation
      ? "Payment received"
      : isLocked || isRedirecting
        ? "Waiting for confirmation"
        : abandoned
          ? "Start a new checkout"
          : "Upgrade to Premium";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl sm:p-7">
        <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-gold/15 blur-[90px]" />

        <div className="relative">
          <p className="eyebrow text-primary">Current plan</p>
          <h2 className="mt-3 font-heading text-[1.6rem] leading-tight tracking-tight sm:text-[2rem]">
            {headline}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">{blurb}</p>

          {isLocked ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/[0.1] px-3.5 py-1.5 text-[0.7rem] text-[#8a6c3a]">
                {awaitingActivation ? (
                  <Clock3 className="size-3" strokeWidth={1.8} />
                ) : (
                  <Loader2 className="size-3 animate-spin" />
                )}
                {awaitingActivation
                  ? "Payment is in — activation is stuck. Do not pay again."
                  : "Checking for confirmation… this page updates itself"}
              </p>
              <button
                type="button"
                onClick={() => void checkNow()}
                disabled={isCheckingNow}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[0.7rem] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
              >
                {isCheckingNow ? <Loader2 className="size-3 animate-spin" /> : null}
                Check now
              </button>
            </div>
          ) : abandoned ? (
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-[0.7rem] text-muted-foreground">
              <Clock3 className="size-3" strokeWidth={1.8} />
              The last checkout was never confirmed. It is safe to try again.
            </p>
          ) : null}

          <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border sm:grid-cols-3">
            {currentPlan.map((item) => (
              <div key={item.label} className="bg-background/70 px-4 py-3">
                <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                  {item.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <article
          className={cn(
            "flex flex-col rounded-2xl border p-6 backdrop-blur-xl",
            isPremium
              ? "border-border/60 bg-card/40"
              : "border-primary/25 bg-card/70 ring-1 ring-primary/10"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl tracking-tight">Free</h3>
            {!isPremium ? (
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[0.58rem] tracking-[0.12em] text-muted-foreground uppercase">
                Current
              </span>
            ) : null}
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Everything you need to get your first bookings.
          </p>

          <p className="mt-5 font-heading text-[2.4rem] leading-none tracking-tight">
            $0
            <span className="ml-1.5 font-sans text-xs font-normal tracking-normal text-muted-foreground">
              forever
            </span>
          </p>

          <ul className="mt-6 flex-1 space-y-2.5 border-t border-border/70 pt-5">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                <Check className="mt-0.5 size-3.5 shrink-0 text-sage" strokeWidth={2.2} />
                {feature}
              </li>
            ))}
          </ul>

          <Button disabled variant="outline" className="mt-6 h-11 w-full rounded-full">
            {isPremium ? "Included in Premium" : "Your current plan"}
          </Button>
        </article>

        <article className="relative flex flex-col overflow-hidden rounded-2xl border border-primary/30 bg-card/70 p-6 shadow-(--shadow-lift) backdrop-blur-xl ring-1 ring-primary/15">
          <div className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-gold/20 blur-[80px]" />

          <div className="relative flex items-center justify-between gap-3">
            <h3 className="font-heading text-xl tracking-tight text-primary">Premium</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.55rem] tracking-[0.14em] text-white uppercase">
              <Sparkles className="size-2.5" strokeWidth={2} />
              Best value
            </span>
          </div>
          <p className="relative mt-1.5 text-xs leading-relaxed text-muted-foreground">
            Stand out and list as many services as you like.
          </p>

          <p className="relative mt-5 font-heading text-[2.4rem] leading-none tracking-tight text-primary">
            {price}
            <span className="ml-1.5 font-sans text-xs font-normal tracking-normal text-muted-foreground">
              / {status.price.days} days
            </span>
          </p>

          <ul className="relative mt-6 flex-1 space-y-2.5 border-t border-border/70 pt-5">
            {PREMIUM_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-foreground/85">
                <Check className="mt-0.5 size-3.5 shrink-0 text-gold" strokeWidth={2.2} />
                {feature}
              </li>
            ))}
          </ul>

          <Button
            onClick={() => void upgrade()}
            disabled={isRedirecting || isPremium || isLocked}
            size="lg"
            className="relative mt-6 h-12 w-full gap-2 rounded-full"
          >
            {isRedirecting || isLocked ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Crown className="size-4" />
            )}
            {buttonLabel}
          </Button>

          <p className="relative mt-3 flex items-center justify-center gap-1.5 text-center text-[0.65rem] text-muted-foreground">
            <ShieldCheck className="size-3 shrink-0" strokeWidth={1.8} />
            {isPremium
              ? `You can renew once this pass expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`
              : awaitingActivation
                ? "Stripe already has your money. A second checkout stays blocked."
                : isLocked
                  ? "A payment is already in progress. Checkout stays locked so you cannot be charged twice."
                  : abandoned
                    ? "The previous attempt expired without a charge."
                    : "Paid on Stripe · activated only after confirmation"}
          </p>
        </article>
      </div>

      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <h2 className="eyebrow text-muted-foreground">Latest payment</h2>
          {latest ? <StatusBadge status={latest.status} /> : null}
        </div>

        {latest ? (
          <>
            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-3">
              <div>
                <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Amount
                </dt>
                <dd className="mt-1 font-heading text-xl leading-none tracking-tight text-foreground">
                  {formatCurrency(latest.amount / 100, latest.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Started
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">
                  {formatDateTime(latest.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                  Reference
                </dt>
                <dd className="mt-1.5 truncate text-xs text-muted-foreground">{latest.id}</dd>
              </div>
            </dl>

            {isLocked ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-gold/35 bg-gold/[0.08] px-4 py-3 text-xs leading-relaxed text-[#8a6c3a]">
                <Clock3 className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.8} />
                {awaitingActivation
                  ? "Stripe has this payment, but the confirmation never reached our server. Do not start another checkout — that would charge you twice. This page keeps checking, so leave it open until Premium unlocks."
                  : "This payment is still awaiting Stripe's confirmation. Starting a new checkout is blocked until it settles, so you cannot be charged twice."}
              </p>
            ) : abandoned ? (
              <p className="mt-5 flex items-start gap-2 rounded-xl border border-border bg-background/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                <Clock3 className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.8} />
                This checkout was never confirmed and no charge was taken. You can start a fresh one.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            No payments yet. Your first upgrade will appear here once Stripe confirms it.
          </p>
        )}
      </section>
    </div>
  );
}
