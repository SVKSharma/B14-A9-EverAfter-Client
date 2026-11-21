import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/reveal";

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-gold/25 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-white/10 blur-[100px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-24">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="eyebrow text-gold">Start planning</p>
              <h2 className="mt-5 font-heading text-[2.1rem] leading-[1.1] tracking-tight sm:text-[3rem]">
                Ready to begin your
                <br className="hidden sm:block" /> <em className="italic">Ever After?</em>
              </h2>
            </div>

            <div className="lg:pb-2">
              <p className="text-sm leading-relaxed text-primary-foreground/70">
                Browse the collection, shortlist the studios you love, and send your first enquiry
                in minutes. Free for couples, always.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link
                  href="/services"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "lg" }),
                    "group h-12 gap-2.5 rounded-full px-7"
                  )}
                >
                  Explore services
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sign-up"
                  className="text-[0.75rem] tracking-[0.14em] text-primary-foreground/80 uppercase underline decoration-primary-foreground/30 underline-offset-8 transition-colors hover:text-primary-foreground hover:decoration-gold"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
