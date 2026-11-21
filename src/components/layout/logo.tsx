import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "default" | "light";
  compact?: boolean;
}

export function Logo({ className, tone = "default", compact = false }: LogoProps) {
  const isLight = tone === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-baseline gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background",
        className
      )}
      aria-label="EverAfter home"
    >
      <span
        className={cn(
          "font-heading text-[1.6rem] leading-none tracking-[-0.01em] transition-opacity group-hover:opacity-80",
          isLight ? "text-white" : "text-foreground"
        )}
      >
        Ever
        <span className={isLight ? "text-gold" : "text-primary"}>After</span>
      </span>
      {compact ? null : (
        <span
          className={cn(
            "hidden text-[0.55rem] tracking-[0.3em] uppercase sm:inline",
            isLight ? "text-white/55" : "text-muted-foreground"
          )}
        >
          Weddings
        </span>
      )}
    </Link>
  );
}
