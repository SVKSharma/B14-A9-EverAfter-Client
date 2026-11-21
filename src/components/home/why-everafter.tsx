import Image from "next/image";
import { Reveal } from "@/components/shared/reveal";

const POINTS = [
  {
    title: "Reviewed before publishing",
    description:
      "Every studio is checked by our team before a single listing goes live. No scraped directories, no dead links.",
  },
  {
    title: "Pricing you can plan around",
    description:
      "Starting prices, locations and full service notes are on the page. You compare before you enquire.",
  },
  {
    title: "Enquiries that stay in one place",
    description:
      "Every request, reply and confirmation is kept in your dashboard, so nothing is lost in an inbox.",
  },
  {
    title: "Free for couples, always",
    description:
      "Browsing and enquiring costs nothing. You settle directly with the vendor you choose.",
  },
];

export function WhyEverAfter() {
  return (
    <section id="why-everafter" className="scroll-mt-24">
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 py-20 sm:px-7 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8 lg:py-28">
        <Reveal>
          <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-muted ring-1 ring-foreground/10">
            <Image
              src="/images/why-everafter.jpg"
              alt="A couple holding hands beside a bouquet"
              fill
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="object-cover"
            />
            <div className="glass-strong absolute inset-x-4 bottom-4 rounded-2xl p-5">
              <p className="font-heading text-xl leading-snug tracking-tight">
                &ldquo;It felt like planning with a friend who knows everyone.&rdquo;
              </p>
              <p className="mt-2 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
                Amara &amp; Jonah · Hudson Valley
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-primary">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Why EverAfter
            </p>
            <h2 className="mt-5 font-heading text-[2rem] leading-[1.15] tracking-tight sm:text-[2.7rem]">
              Planning should feel like the best part
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-3">
            {POINTS.map((point, index) => (
              <Reveal key={point.title} delay={index * 0.06}>
                <div className="rounded-xl border border-border/70 bg-card/60 p-5">
                  <h3 className="font-heading text-lg tracking-tight text-foreground">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
