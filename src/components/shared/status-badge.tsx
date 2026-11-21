import { cn } from "@/lib/utils";
import type { BookingStatus, ServiceStatus, TransactionStatus } from "@/types";

type Status = BookingStatus | ServiceStatus | TransactionStatus;

const STYLES: Record<Status, string> = {
  pending: "border-[#c9a675]/45 bg-[#c9a675]/10 text-[#8a6c3a]",
  approved: "border-[#8ba185]/45 bg-[#a0aa96]/14 text-[#4f6b52]",
  accepted: "border-[#8ba185]/45 bg-[#a0aa96]/14 text-[#4f6b52]",
  success: "border-[#8ba185]/45 bg-[#a0aa96]/14 text-[#4f6b52]",
  rejected: "border-destructive/25 bg-destructive/[0.07] text-destructive",
  failed: "border-destructive/25 bg-destructive/[0.07] text-destructive",
  cancelled: "border-border bg-muted/60 text-muted-foreground",
  expired: "border-border bg-muted/60 text-muted-foreground",
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
        "inline-flex h-6 items-center rounded-full border px-2.5 text-[0.68rem] font-medium tracking-[0.08em] uppercase",
        STYLES[status],
        className
      )}
    >
      {LABELS[status]}
    </span>
  );
}
