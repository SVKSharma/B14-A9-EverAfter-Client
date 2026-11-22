import Link from "next/link";
import { ArrowLeft, Heart, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SetTitle } from "@/components/shared/set-title";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  { label: "Photography", href: "/services?category=photography" },
  { label: "Venues", href: "/services?category=venues" },
  { label: "Catering", href: "/services?category=catering" },
];

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-16 sm:px-7">
      <SetTitle title="Page not found" />
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-24 top-1/4 size-80 rounded-full bg-gold/18 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 size-72 rounded-full bg-sage/20 blur-[110px]" />

      <div className="glass-strong relative w-full max-w-xl rounded-3xl p-8 text-center sm:p-11">
        <span className="mx-auto grid size-16 place-items-center rounded-full border border-primary/20 bg-primary/[0.05] text-primary">
          <SearchX className="size-7" strokeWidth={1.5} />
        </span>

        <p className="eyebrow mt-7 text-primary">Page not found</p>

        <h1 className="mt-4">
          <span className="block font-heading text-[4rem] leading-none tracking-[-0.03em] text-primary sm:text-[4.8rem]">
            404
          </span>
          <span className="mt-4 block font-heading text-[1.7rem] leading-[1.15] tracking-tight sm:text-[2.1rem]">
            This page took a <em className="italic text-primary">different aisle.</em>
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          We could not find the page you were looking for — it may have moved, or the link is out of
          date.
        </p>

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-6")}
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-full px-6"
            )}
          >
            <Heart className="size-4" />
            Browse services
          </Link>
        </div>

        <div className="mt-9 border-t border-border/70 pt-6">
          <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
            Or start here
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex h-8 items-center rounded-full border border-border/80 bg-background/60 px-3.5 text-[0.7rem] text-foreground/80 transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
