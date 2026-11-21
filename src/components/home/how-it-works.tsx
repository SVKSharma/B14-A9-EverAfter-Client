import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

const STEPS = [
  {
    index: "01",
    title: "Find your people",
    description:
      "Browse by discipline, location or price and save the studios whose work feels like you — not like a template.",
  },
  {
    index: "02",
    title: "Send an enquiry",
    description:
      "Share your date, your venue and a line about the day you are imagining. Vendors reply directly, in one thread.",
  },
  {
    index: "03",
    title: "Confirm with confidence",
    description:
      "Track every reply from your dashboard, compare your shortlist, and lock in the team that will carry the day.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 border-t border-border/70 bg-card/60">
      <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
        <Reveal>
          <SectionHeading
            eyebrow="How it works"
            title="Three quiet steps"
            description="No phone tag, no scattered spreadsheets. Enquiries, replies and confirmations live in one place."
          />
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.index} delay={index * 0.08}>
              <div className="glass flex h-full flex-col rounded-2xl p-7 lg:p-9">
                <span className="font-heading text-[2.4rem] leading-none text-primary/25">
                  {step.index}
                </span>
                <h3 className="mt-6 font-heading text-2xl leading-snug tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
