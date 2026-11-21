import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
  tone?: "default" | "primary" | "warning" | "success";
}

const ACCENTS = {
  default: "text-muted-foreground",
  primary: "text-primary",
  warning: "text-[#a5763a]",
  success: "text-[#4f6b52]",
} as const;

export function StatCard({ icon: Icon, label, value, hint, className, tone = "default" }: StatCardProps) {
  return (
    <div className={cn("flex flex-col bg-card p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow text-muted-foreground">{label}</p>
        <Icon className={cn("size-3.5 shrink-0", ACCENTS[tone])} strokeWidth={1.5} />
      </div>
      <p className="mt-4 font-heading text-[2.1rem] leading-none tracking-tight text-foreground">
        {value}
      </p>
      {hint ? <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function StatStrip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {children}
    </div>
  );
}
