import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  tone?: "default" | "light";
}

export function Logo({ className, tone = "default" }: LogoProps) {
  const isLight = tone === "light";

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
        className
      )}
      aria-label="EverAfter home"
    >
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full border transition-colors",
          isLight
            ? "border-white/25 bg-white/10 group-hover:bg-white/20"
            : "border-primary/15 bg-primary/5 group-hover:bg-primary/10"
        )}
      >
        <Heart
          className={cn(
            "size-4 transition-transform group-hover:scale-110",
            isLight ? "text-white" : "text-primary"
          )}
          strokeWidth={1.75}
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-2xl font-semibold tracking-tight",
            isLight ? "text-white" : "text-foreground"
          )}
        >
          EverAfter
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.22em]",
            isLight ? "text-white/60" : "text-muted-foreground"
          )}
        >
          Wedding marketplace
        </span>
      </span>
    </Link>
  );
}
