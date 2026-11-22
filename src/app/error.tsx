"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppError({
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
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16 sm:px-7">
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-1/4 size-80 rounded-full bg-destructive/12 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 size-72 rounded-full bg-gold/15 blur-[110px]" />

      <div className="glass-strong relative w-full max-w-xl rounded-3xl p-8 text-center sm:p-11">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-destructive/25 bg-destructive/[0.06] text-destructive">
          <TriangleAlert className="size-7" strokeWidth={1.5} />
        </span>

        <p className="eyebrow mt-7 text-primary">Unexpected stop</p>
        <h1 className="mt-3.5 font-heading text-[1.9rem] leading-[1.12] tracking-tight sm:text-[2.4rem]">
          Something went <em className="italic text-primary">wrong.</em>
        </h1>
        <p className="mx-auto mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground">
          An unexpected error interrupted this page. Try again, or head back home while we sort it
          out.
        </p>

        {error.digest ? (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/60 px-3 py-1 font-mono text-[0.62rem] text-muted-foreground">
            Reference {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button size="lg" className="h-11 gap-2 rounded-full px-6" onClick={reset}>
            <RotateCcw className="size-4" />
            Try again
          </Button>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-full px-6"
            )}
          >
            <Home className="size-4" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
