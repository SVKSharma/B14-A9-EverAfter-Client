import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Hero } from "@/components/home/hero";
import { CategoryShowcase } from "@/components/home/category-showcase";
import { FeaturedServices } from "@/components/home/featured-services";
import { HowItWorks } from "@/components/home/how-it-works";
import { WhyEverAfter } from "@/components/home/why-everafter";
import { Stories } from "@/components/home/stories";
import { ClosingCta } from "@/components/home/closing-cta";

export const metadata: Metadata = {
  title: "Wedding Services Marketplace",
  description:
    "Discover and book trusted wedding venues, photographers, florists, caterers, and stylists. Your day. Your dream. Your Ever After.",
};

const STATS = [
  { value: "500+", label: "Curated vendors" },
  { value: "2,400+", label: "Couples matched" },
  { value: "6", label: "Disciplines" },
  { value: "4.9", label: "Average rating" },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="relative z-10 mx-auto -mt-6 w-full max-w-7xl px-5 sm:px-7 lg:px-8">
        <div className="glass-strong grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/40 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-card/70 px-4 py-6 text-center sm:px-6">
              <p className="font-heading text-[1.8rem] leading-none tracking-tight text-primary sm:text-[2.1rem]">
                {stat.value}
              </p>
              <p className="mt-2 text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <CategoryShowcase />

      <section className="border-t border-border/70">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <SectionHeading
                eyebrow="Featured"
                title="Recently approved"
                description="The newest listings from vendors we have reviewed and published this month."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Link
                href="/services"
                className="group inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.14em] text-primary uppercase"
              >
                Browse all
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14">
            <FeaturedServices />
          </div>
        </div>
      </section>

      <HowItWorks />
      <WhyEverAfter />
      <Stories />
      <ClosingCta />
    </>
  );
}
