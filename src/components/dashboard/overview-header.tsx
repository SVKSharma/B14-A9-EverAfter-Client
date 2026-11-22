import type { ReactNode } from "react";

interface OverviewHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function OverviewHeader({ eyebrow, title, description, actions }: OverviewHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 px-6 py-7 backdrop-blur-xl sm:px-8 sm:py-9">
      <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-gold/15 blur-[90px]" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h1 className="mt-3 font-heading text-[1.9rem] leading-[1.1] tracking-[-0.015em] text-foreground sm:text-[2.5rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
