import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Payment Cancelled" };

export default function SubscriptionCancelPage() {
  return (
    <div className="py-6">
      <Card className="mx-auto max-w-xl border-border/80">
        <CardContent className="space-y-5 p-8 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-full bg-secondary">
            <CreditCard className="size-7 text-muted-foreground" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-semibold">Checkout cancelled</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Nothing was charged and your plan has not changed. You can upgrade whenever you are
              ready.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/vendor/subscription"
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
            >
              Back to plans
            </Link>
            <Link
              href="/dashboard/vendor"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 px-5")}
            >
              Go to dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
