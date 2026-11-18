import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Camera,
  Check,
  Flower2,
  HeartHandshake,
  Landmark,
  ShieldCheck,
  Shirt,
  Sparkles,
  Star,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { MotionReveal } from "@/components/shared/motion-reveal";
import { FeaturedServices } from "@/components/home/featured-services";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wedding Services Marketplace",
  description:
    "Discover and book trusted wedding venues, photographers, florists, caterers, and stylists. Your day. Your dream. Your Ever After.",
};

const CATEGORY_ICONS = {
  photography: Camera,
  venues: Landmark,
  decoration: Flower2,
  catering: UtensilsCrossed,
  makeup: Sparkles,
  fashion: Shirt,
} as const;

const TRUST_POINTS = ["Verified vendors", "Transparent pricing", "Free to browse"];

const STATS = [
  { value: "500+", label: "Curated vendors" },
  { value: "2,400+", label: "Happy couples" },
  { value: "6", label: "Service categories" },
  { value: "4.9/5", label: "Average rating" },
];

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Verified, reviewed vendors",
    description:
      "Every vendor is reviewed by our team before going live, so you can book with confidence.",
  },
  {
    icon: Wallet,
    title: "Transparent pricing",
    description:
      "See starting prices, locations, and full service details upfront. No surprises, no pressure.",
  },
  {
    icon: CalendarCheck,
    title: "Effortless booking",
    description:
      "Send a booking request in seconds and track every response from your personal dashboard.",
  },
  {
    icon: HeartHandshake,
    title: "Support for the whole journey",
    description:
      "From the first idea to the last dance, we help you keep every detail calm and organised.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Discover your dream team",
    description:
      "Browse by category, search by name, and filter by location to find vendors who match your vision.",
  },
  {
    step: "02",
    title: "Send a booking request",
    description:
      "Share your event date, venue, and a short message. Vendors respond directly through EverAfter.",
  },
  {
    step: "03",
    title: "Celebrate with confidence",
    description:
      "Track every request from your dashboard, confirm your favourites, and get back to enjoying the moment.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-secondary/70 via-background to-background">
        <div className="pointer-events-none absolute -right-24 top-10 size-96 rounded-full bg-accent/40 blur-3xl" />
        <div className="pointer-events-none absolute -left-36 bottom-0 size-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <MotionReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-primary/90 shadow-sm">
              <Sparkles className="size-3.5" />
              Wedding services, thoughtfully curated
            </span>

            <h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Your day. Your dream.{" "}
              <span className="italic text-primary">Your Ever After.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Discover trusted wedding venues, photographers, florists, caterers and stylists —
              then book them in one place. From the first idea to the last dance, we make planning
              feel beautiful.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/services"
                className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-6 text-base shadow-md")}
              >
                Explore Wedding Services
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sign-up?role=vendor"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-6 text-base"
                )}
              >
                Join as a vendor
              </Link>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {TRUST_POINTS.map((point) => (
                <li key={point} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </MotionReveal>

          <MotionReveal delay={0.12} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="absolute -inset-3 -rotate-2 rounded-t-[13rem] rounded-b-[2.5rem] border border-gold/40" />
            <div className="relative aspect-4/5 overflow-hidden rounded-t-[12rem] rounded-b-3xl shadow-2xl shadow-primary/20 ring-1 ring-primary/10">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80"
                alt="A newlywed couple holding a bouquet in warm evening light"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-plum/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -left-3 bottom-8 hidden rounded-2xl border border-border/70 bg-background/95 px-5 py-4 shadow-xl backdrop-blur sm:block">
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 text-sm font-semibold">Loved by 2,400+ couples</p>
              <p className="text-xs text-muted-foreground">Real weddings, real reviews</p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/70 bg-background">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-semibold tracking-tight text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Explore by category"
            title="Everything your wedding needs"
            description="Six carefully curated categories, one calm place to plan. Start wherever your imagination takes you."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View all services
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.value];
            return (
              <MotionReveal key={category.value} delay={index * 0.05}>
                <Link
                  href={`/services?category=${category.value}`}
                  className="group flex h-full flex-col gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-md"
                >
                  <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </span>
                  <div>
                    <h3 className="font-heading text-xl font-semibold tracking-tight">
                      {category.label}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {category.blurb}
                    </p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-medium text-primary">
                    Explore
                    <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </MotionReveal>
            );
          })}
        </div>
      </section>

      {/* Featured services */}
      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Featured services"
              title="Freshly approved, ready to book"
              description="A hand-picked look at the newest services from our verified vendors."
            />
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              Browse all
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="mt-10">
            <FeaturedServices />
          </div>
        </div>
      </section>

      {/* Why EverAfter */}
      <section id="why-everafter" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Why EverAfter"
          title="Planning should feel like the best part"
          description="We take the noise out of wedding planning so you can focus on the moments that matter."
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit, index) => (
            <MotionReveal key={benefit.title} delay={index * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
                <span className="grid size-11 place-items-center rounded-xl bg-accent/60 text-plum">
                  <benefit.icon className="size-5" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-heading text-lg font-semibold leading-snug">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </MotionReveal>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to your Ever After"
            description="Simple, transparent, and designed to keep you present while everything comes together."
            align="center"
          />

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((item, index) => (
              <MotionReveal key={item.step} delay={index * 0.08}>
                <div className="relative flex h-full flex-col rounded-2xl border border-border/70 bg-background p-7 shadow-sm">
                  <span className="font-heading text-4xl font-semibold text-primary/25">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-heading text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-plum px-6 py-16 text-center shadow-xl sm:px-12 lg:py-20">
          <Image
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1600&q=75"
            alt="Two decorated chairs waiting for a couple beside a lake"
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-linear-to-r from-plum via-plum/85 to-plum/60" />
          <div className="relative mx-auto max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              Start planning today
            </p>
            <h2 className="mt-4 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Ready to begin your Ever After?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Browse hundreds of wedding services, compare your favourites, and send your first
              booking request in minutes.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/services"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "h-12 gap-2 bg-background px-6 text-base text-foreground hover:bg-background/90"
                )}
              >
                Explore services
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/sign-up"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
                )}
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
