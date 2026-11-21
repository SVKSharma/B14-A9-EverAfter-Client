import { Reveal } from "@/components/shared/reveal";

const STORIES = [
  {
    quote:
      "We found our photographer in an afternoon and had a reply by the evening. After months of unanswered emails elsewhere, that alone was worth it.",
    name: "Amara & Jonah",
    detail: "Hudson Valley · September 2025",
  },
  {
    quote:
      "The starting prices were actually real. We planned our whole budget from the listings before we spoke to anyone.",
    name: "Priya & Lucas",
    detail: "Lake Como · June 2025",
  },
  {
    quote:
      "Having every reply in one dashboard meant we never lost a thread between three vendors and two sets of parents.",
    name: "Elena & Marcus",
    detail: "Somerset · April 2025",
  },
];

const DESTINATIONS = [
  { city: "New York", count: "42 studios" },
  { city: "London", count: "36 studios" },
  { city: "Lisbon", count: "28 studios" },
  { city: "Tuscany", count: "19 studios" },
];

export function Stories() {
  return (
    <section id="stories" className="relative scroll-mt-24 overflow-hidden border-t border-border/70">
      <div className="mesh pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-20 sm:px-7 lg:px-8 lg:py-28">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-primary">
            <span className="h-px w-8 bg-gold" aria-hidden="true" />
            Couple stories
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {STORIES.map((story, index) => (
            <Reveal key={story.name} delay={index * 0.08}>
              <figure className="glass flex h-full flex-col rounded-2xl p-7">
                <span aria-hidden="true" className="font-heading text-4xl leading-none text-gold">
                  &ldquo;
                </span>
                <blockquote className="mt-4 flex-1 font-heading text-lg leading-relaxed tracking-tight text-foreground">
                  {story.quote}
                </blockquote>
                <figcaption className="mt-6 border-t border-border/70 pt-5">
                  <p className="text-sm font-medium text-foreground">{story.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{story.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((entry) => (
              <div
                key={entry.city}
                className="flex items-baseline justify-between gap-3 rounded-xl border border-border/70 bg-card/60 px-5 py-4"
              >
                <p className="font-heading text-lg tracking-tight text-foreground">{entry.city}</p>
                <p className="text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                  {entry.count}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
