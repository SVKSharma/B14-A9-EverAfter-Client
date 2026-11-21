import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
  tone?: "default" | "primary" | "warning" | "success";
}

const TONES = {
  default: "bg-secondary text-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
} as const;

export function StatCard({ icon: Icon, label, value, hint, className, tone = "default" }: StatCardProps) {
  return (
    <Card className={cn("border-border/80", className)}>
      <CardContent className="flex items-start gap-4 p-5">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", TONES[tone])}>
          <Icon className="size-5" strokeWidth={1.7} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-1 font-heading text-3xl font-semibold leading-none tracking-tight">
            {value}
          </p>
          {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
