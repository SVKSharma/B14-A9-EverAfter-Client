"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home, RotateCcw, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GlobalError({
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
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-secondary/60 to-background px-6 text-center">
      <span className="grid size-16 place-items-center rounded-full border border-destructive/20 bg-destructive/5">
        <TriangleAlert className="size-7 text-destructive" strokeWidth={1.5} />
      </span>
      <h1 className="mt-6 font-heading text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        An unexpected error interrupted this page. You can try again, or head back home while we
        sort it out.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Button size="lg" className="h-11 gap-2 px-6" onClick={reset}>
          <RotateCcw className="size-4" />
          Try again
        </Button>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 gap-2 px-6")}
        >
          <Home className="size-4" />
          Back home
        </Link>
      </div>
    </div>
  );
}
