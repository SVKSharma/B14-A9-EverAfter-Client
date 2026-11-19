"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const POLL_MS = 2500;
const MAX_POLLS = 8;

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

  return (
    <Card className="mx-auto max-w-xl border-border/80">
      <CardContent className="space-y-5 p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-primary/10">
          {isPremium ? (
            <CheckCircle2 className="size-7 text-primary" />
          ) : message ? (
            <XCircle className="size-7 text-destructive" />
          ) : (
            <Clock3 className="size-7 text-amber-600" />
          )}
        </div>

        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {isPremium
              ? "You are Premium"
              : message
                ? "We could not confirm this payment"
                : "Payment received"}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isPremium && plan?.expiresAt
              ? `Premium is active until ${formatDateTime(plan.expiresAt)}.`
              : message
                ? message
                : checking
                  ? "Waiting for Stripe to confirm the payment with our server…"
                  : paid
                    ? "Stripe confirms your payment. Activation usually lands within a few seconds — check again shortly."
                    : "This checkout has not been paid yet. Nothing has been charged."}
          </p>
        </div>

        {checking ? (
          <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin" />
            Checking activation…
          </p>
        ) : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/dashboard/vendor" className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}>
            Go to dashboard
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="h-10 px-5"
            onClick={() => setAttempt((current) => current + 1)}
            disabled={checking}
          >
            Check again
          </Button>
        </div>

        <Link
          href="/dashboard/vendor/subscription"
          className="block text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Back to plans
        </Link>
      </CardContent>
    </Card>
  );
}
