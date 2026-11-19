import type { Role } from "@/types";

/** Coerce anything that comes out of the session into a known role. */
export function normalizeRole(value: unknown): Role {
  return value === "admin" || value === "vendor" || value === "customer" ? value : "customer";
}
