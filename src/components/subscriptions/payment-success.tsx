"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";

interface SessionSummary {
  id: string;
  status: string | null;
  paymentStatus: string | null;
  amount: number | null;
  currency: string | null;
}

interface PlanStatus {
  plan: "free" | "premium";
  expiresAt: string | null;
}

const POLL_MS = 3000;
const MAX_POLLS = 12;

function delay(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Stripe redirects here as soon as payment succeeds, but Premium only turns on
 * when the webhook reaches the server. So the page polls the plan briefly and,
 * if the webhook is still in flight, explains that clearly instead of claiming
 * a state the server has not confirmed.
 */
export function PaymentSuccess({ sessionId }: { sessionId: string | null }) {
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [plan, setPlan] = useState<PlanStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    // Kicks off after the first tick so the effect never sets state
    // synchronously on mount.
    const run = async () => {
      await Promise.resolve();
      if (cancelled) return;
      setIsChecking(true);

      for (let poll = 0; poll < MAX_POLLS && !cancelled; poll += 1) {
        if (poll > 0) await delay(POLL_MS);
        if (cancelled) return;

        try {
          const [session, status] = await Promise.all([
            apiFetch<SessionSummary>(
              `/subscriptions/session?session_id=${encodeURIComponent(sessionId)}`
            ),
            apiFetch<PlanStatus>("/subscriptions/status"),
          ]);

          if (cancelled) return;

          setSummary(session);
          setPlan(status);
          setError(null);

          if (status.plan === "premium") {
            setIsChecking(false);
            return;
          }
        } catch (cause) {
          if (cancelled) return;
          setError(getErrorMessage(cause));
          setIsChecking(false);
          return;
        }
      }

      if (!cancelled) setIsChecking(false);
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [sessionId, attempt]);

  const paid = summary?.paymentStatus === "paid";
  const isPremium = plan?.plan === "premium";
  // Derived instead of stored, so the missing-parameter case never needs a
  // setState inside the effect.
  const missingSession = !sessionId;
  const message = missingSession
    ? "This link is missing its checkout session, so there is nothing to confirm."
    : error;
  const checking = isChecking && !missingSession;

  const tone = isPremium ? "success" : message ? "error" : "pending";

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-card/70 p-8 text-center backdrop-blur-xl sm:p-10",
          tone === "success" && "border-sage/50",
          tone === "error" && "border-destructive/30",
          tone === "pending" && "border-border/70"
        )}
      >
        <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full blur-[90px]"
          aria-hidden="true"
          style={{
            backgroundColor:
              tone === "success"
                ? "color-mix(in srgb, var(--sage) 35%, transparent)"
                : tone === "error"
                  ? "color-mix(in srgb, var(--destructive) 22%, transparent)"
                  : "color-mix(in srgb, var(--gold) 28%, transparent)",
          }}
        />

        <div className="relative">
          <span
            className={cn(
              "mx-auto grid size-16 place-items-center rounded-full border",
              tone === "success" && "border-sage/50 bg-sage/15 text-[#4f6b52]",
              tone === "error" && "border-destructive/30 bg-destructive/[0.08] text-destructive",
              tone === "pending" && "border-gold/45 bg-gold/[0.12] text-[#8a6c3a]"
            )}
          >
            {tone === "success" ? (
              <CheckCircle2 className="size-7" strokeWidth={1.7} />
            ) : tone === "error" ? (
              <XCircle className="size-7" strokeWidth={1.7} />
            ) : (
              <Clock3 className="size-7" strokeWidth={1.7} />
            )}
          </span>

          <p className="eyebrow mt-6 text-primary">Checkout</p>
          <h1 className="mt-3 font-heading text-[1.8rem] leading-tight tracking-tight sm:text-[2.2rem]">
            {isPremium
              ? "You are Premium"
              : message
                ? "We could not confirm this payment"
                : "Payment received"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {isPremium && plan?.expiresAt
              ? `Premium is active until ${formatDateTime(plan.expiresAt)}.`
              : message
                ? message
                : checking
                  ? "Waiting for Stripe to confirm the payment with our server — this usually takes a few seconds."
                  : paid
                    ? "Stripe confirms your payment. Activation usually lands within a few seconds — check again shortly."
                    : "This checkout has not been paid yet. Nothing has been charged."}
          </p>

          {checking ? (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-[0.7rem] text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Checking activation…
            </p>
          ) : null}

          <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border text-left sm:grid-cols-2">
            <div className="bg-background/70 px-4 py-3">
              <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                Plan
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {isPremium ? "Premium" : "Awaiting confirmation"}
              </dd>
            </div>
            <div className="bg-background/70 px-4 py-3">
              <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                Amount
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                {summary?.amount != null && summary.currency
                  ? new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: summary.currency.toUpperCase(),
                    }).format(summary.amount / 100)
                  : "—"}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/vendor"
              className={cn(buttonVariants({ size: "lg" }), "h-11 rounded-full px-6")}
            >
              Go to dashboard
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="h-11 rounded-full px-6"
              onClick={() => setAttempt((current) => current + 1)}
              disabled={checking}
            >
              Check again
            </Button>
          </div>

          <Link
            href="/dashboard/vendor/subscription"
            className="mt-5 inline-block text-[0.7rem] tracking-[0.1em] text-muted-foreground uppercase underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Back to plans
          </Link>
        </div>
      </div>
    </div>
  );
}
