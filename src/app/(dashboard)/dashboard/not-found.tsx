import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SetTitle } from "@/components/shared/set-title";
import { cn } from "@/lib/utils";

/**
 * Scoped to the dashboard so a missing record keeps the sidebar and header
 * instead of throwing the user out to the public 404.
 */
export default function DashboardNotFound() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 px-6 py-16 text-center backdrop-blur-xl sm:px-10">
      <SetTitle title="Not found" />
      <div className="mesh pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <span className="mx-auto grid size-14 place-items-center rounded-full border border-primary/20 bg-primary/[0.05] text-primary">
          <SearchX className="size-6" strokeWidth={1.5} />
        </span>

        <p className="eyebrow mt-6 text-primary">Error 404</p>

        <h1 className="mt-3">
          <span className="block font-heading text-[2.9rem] leading-none tracking-[-0.02em] text-primary/85">
            404
          </span>
          <span className="mt-3 block font-heading text-[1.6rem] leading-tight tracking-tight sm:text-[1.9rem]">
            We could not find that record
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          The page or record does not exist. It may have been removed, or the link you followed is
          out of date.
        </p>

        <Link
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "mt-7 h-11 gap-2 rounded-full px-6"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
