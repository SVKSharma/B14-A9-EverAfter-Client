import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <p className="eyebrow flex items-center gap-3 text-primary">
          {align === "center" ? null : <span className="h-px w-8 bg-gold" aria-hidden="true" />}
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 font-heading text-[2rem] leading-[1.15] tracking-tight text-foreground sm:text-[2.6rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
