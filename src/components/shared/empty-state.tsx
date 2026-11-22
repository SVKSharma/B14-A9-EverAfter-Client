import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/70 px-6 py-16 text-center",
        className
      )}
    >
      <span className="grid size-12 place-items-center rounded-full border border-border bg-background">
        <Icon className="size-5 text-primary" strokeWidth={1.4} />
      </span>
      <h3 className="mt-6 font-heading text-2xl tracking-tight">{title}</h3>
      {description ? (
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
