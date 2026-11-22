"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Scoped error boundary for the dashboard: keeps the sidebar and header in
 * place so the user can navigate away from the failed page.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-destructive/25 bg-card/60 px-6 py-16 text-center backdrop-blur-xl sm:px-10">
      <div className="mesh pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-destructive/25 bg-destructive/[0.06] text-destructive">
          <TriangleAlert className="size-6" strokeWidth={1.6} />
        </span>

        <p className="eyebrow mt-6 text-primary">Something went wrong</p>
        <h1 className="mt-3 font-heading text-[1.7rem] leading-tight tracking-tight sm:text-[2.1rem]">
          This page could not load
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          Your account and data are safe. Try loading the page again.
        </p>

        <Button
          size="lg"
          className="mt-7 h-11 gap-2 rounded-full px-6"
          onClick={reset}
        >
          <RotateCcw className="size-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
