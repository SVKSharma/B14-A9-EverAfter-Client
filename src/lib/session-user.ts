import { normalizeRole } from "@/lib/roles";
import type { SessionUser } from "@/types";

interface RawSessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role?: unknown;
  isBlocked?: unknown;
  businessName?: unknown;
  subscriptionPlan?: unknown;
}

/** Map a Better Auth user (with additional fields) into the app shape. */
export function toSessionUser(user: RawSessionUser): SessionUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    role: normalizeRole(user.role),
    isBlocked: Boolean(user.isBlocked),
    businessName: typeof user.businessName === "string" ? user.businessName : null,
    subscriptionPlan: user.subscriptionPlan === "premium" ? "premium" : "free",
  };
}
