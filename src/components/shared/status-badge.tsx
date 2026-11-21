import { cn } from "@/lib/utils";
import type { BookingStatus, ServiceStatus, TransactionStatus } from "@/types";

type Status = BookingStatus | ServiceStatus | TransactionStatus;

const STYLES: Record<Status, string> = {
  // shared across the three models
  pending: "bg-amber-500/10 text-amber-700 ring-amber-600/20 dark:text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  accepted: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  success: "bg-emerald-500/10 text-emerald-700 ring-emerald-600/20 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive ring-destructive/20",
  failed: "bg-destructive/10 text-destructive ring-destructive/20",
  cancelled: "bg-muted text-muted-foreground ring-border",
  expired: "bg-muted text-muted-foreground ring-border",
};

const LABELS: Record<Status, string> = {
  pending: "Pending",
  approved: "Approved",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
  success: "Success",
  failed: "Failed",
  expired: "Expired",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset",
        STYLES[status],
        className
      )}
    >
      {LABELS[status]}
    </span>
  );
}
