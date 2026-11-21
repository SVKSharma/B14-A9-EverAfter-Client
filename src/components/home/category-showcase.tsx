import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal, RevealGroup, RevealItem } from "@/components/shared/reveal";

const CATEGORY_IMAGES: Record<string, string> = {
  photography: "/images/category-photography.jpg",
  venues: "/images/category-venues.jpg",
  decoration: "/images/category-decoration.jpg",
  catering: "/images/category-catering.jpg",
  makeup: "/images/category-makeup.jpg",
  fashion: "/images/category-fashion.jpg",
};

export function CategoryShowcase() {
  return (
    <section className="relative border-t border-border/70">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              eyebrow="The collection"
              title="Every detail, in its place"
              description="Six disciplines, each with vendors we have met, reviewed and chosen to represent the standard we hold."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/services"
              className="group inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.14em] text-primary uppercase"
            >
              All services
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <RevealItem key={category.value}>
              <Link
                href={`/services?category=${category.value}`}
                className="group relative flex h-56 items-end overflow-hidden rounded-2xl border border-white/45 bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-64"
              >
                <Image
                  src={CATEGORY_IMAGES[category.value]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-linear-to-t from-charcoal/80 via-charcoal/25 to-transparent" />

                <div className="relative flex w-full items-end justify-between gap-3 p-5">
                  <div className="min-w-0">
                    <p className="text-[0.6rem] tracking-[0.18em] text-white/60 uppercase">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-1.5 truncate font-heading text-xl tracking-tight text-white sm:text-2xl">
                      {category.label}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-white/65">{category.blurb}</p>
                  </div>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-charcoal">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
