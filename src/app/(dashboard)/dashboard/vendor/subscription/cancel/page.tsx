import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CreditCard, ReceiptText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function SubscriptionCancelPage() {
  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-8 text-center backdrop-blur-xl sm:p-10">
        <div className="mesh pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-plum/15 blur-[90px]" />

        <div className="relative">
          <span className="mx-auto grid size-16 place-items-center rounded-full border border-border bg-background text-muted-foreground">
            <CreditCard className="size-7" strokeWidth={1.6} />
          </span>

          <p className="eyebrow mt-6 text-primary">Checkout</p>
          <h1 className="mt-3 font-heading text-[1.8rem] leading-tight tracking-tight sm:text-[2.2rem]">
            Checkout cancelled
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Nothing was charged and your plan has not changed. You can upgrade whenever you are
            ready.
          </p>

          <dl className="mt-7 grid gap-px overflow-hidden rounded-xl border border-border/70 bg-border text-left sm:grid-cols-2">
            <div className="bg-background/70 px-4 py-3">
              <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                Charge
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">None</dd>
            </div>
            <div className="bg-background/70 px-4 py-3">
              <dt className="text-[0.58rem] tracking-[0.14em] text-muted-foreground uppercase">
                Plan
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">Unchanged</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-6")}
            >
              <ReceiptText className="size-4" />
              Back to plans
            </Link>
            <Link
              href="/dashboard/vendor"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 gap-2 rounded-full px-6"
              )}
            >
              <ArrowLeft className="size-4" />
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
