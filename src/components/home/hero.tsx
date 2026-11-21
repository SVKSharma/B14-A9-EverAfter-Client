"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] as const },
        };

  return (
    <section className="relative overflow-hidden">
      <div className="mesh pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute -left-32 top-24 size-80 rounded-full bg-gold/20 blur-[110px]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:px-8 lg:pb-28 lg:pt-20 xl:gap-24">
        <div className="max-w-xl">
          <motion.div {...rise(0)}>
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5">
              <Sparkles className="size-3 text-gold" strokeWidth={1.8} />
              <span className="eyebrow text-foreground/75">Curated wedding vendors</span>
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="mt-8 font-heading text-[2.85rem] leading-[1.02] tracking-[-0.02em] text-foreground sm:text-[3.9rem] lg:text-[4.6rem]"
          >
            Every great wedding
            <br />
            <em className="italic text-primary">begins with the right people.</em>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-8 max-w-lg text-base leading-relaxed text-muted-foreground"
          >
            A considered collection of photographers, venues, florists and stylists — brought
            together so planning feels as beautiful as the day itself.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "group h-12 gap-2.5 rounded-full px-7"
              )}
            >
              Explore the collection
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sign-up?role=vendor"
              className="group inline-flex items-center gap-1.5 text-[0.78rem] tracking-[0.12em] text-foreground uppercase"
            >
              List your studio
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          <motion.div
            {...rise(0.32)}
            className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border/70 pt-7"
          >
            <div className="flex items-center gap-0.5 text-gold">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-3 fill-current" strokeWidth={0} />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="text-foreground">4.9 average</span> from 2,400+ couples
            </p>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
            <p className="hidden text-xs text-muted-foreground sm:block">Verified vendors only</p>
          </motion.div>
        </div>

        <motion.div {...rise(0.18)} className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted ring-1 ring-foreground/10">
            <Image
              src="/images/hero.jpg"
              alt="A newlywed couple holding a bouquet in warm evening light"
              fill
              priority
              sizes="(min-width: 1024px) 46vw, 92vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-charcoal/55 via-charcoal/5 to-transparent" />

            <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6">
              <div className="glass-strong rounded-2xl p-5">
                <p className="eyebrow text-gold">Featured this week</p>
                <p className="mt-2.5 font-heading text-lg leading-snug tracking-tight text-foreground">
                  Editorial weddings, quietly planned
                </p>
                <Link
                  href="/services?sort=newest"
                  className="mt-3 inline-flex items-center gap-1 text-[0.62rem] tracking-[0.16em] text-primary uppercase"
                >
                  See what&apos;s new
                  <ArrowUpRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>

          <div className="glass absolute -right-2 top-6 hidden rounded-2xl px-4 py-3 lg:block">
            <p className="font-heading text-2xl leading-none text-foreground">500+</p>
            <p className="mt-1 text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
              Studios
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
