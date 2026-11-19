import type { Role } from "@/types";

/**
 * Single source of truth for protected areas.
 * Key = path prefix, value = roles allowed inside it.
 */
export const ROUTE_ACCESS: Record<string, { roles: Role[] }> = {
  "/dashboard": { roles: ["admin", "vendor", "customer"] },
  "/dashboard/admin": { roles: ["admin"] },
  "/dashboard/admin/users": { roles: ["admin"] },
  "/dashboard/admin/services": { roles: ["admin"] },
  "/dashboard/admin/transactions": { roles: ["admin"] },
  "/dashboard/vendor": { roles: ["vendor"] },
  "/dashboard/vendor/services": { roles: ["vendor"] },
  "/dashboard/vendor/bookings": { roles: ["vendor"] },
  "/dashboard/customer": { roles: ["customer"] },
  "/dashboard/customer/bookings": { roles: ["customer"] },
  "/dashboard/profile": { roles: ["admin", "vendor", "customer"] },
};

export interface RouteAccessMatch {
  pattern: string;
  roles: Role[];
}

/** Longest-prefix match so nested pages inherit their section's rule. */
export function resolveRouteAccess(pathname: string): RouteAccessMatch | null {
  const match = Object.keys(ROUTE_ACCESS)
    .filter((pattern) => pathname === pattern || pathname.startsWith(`${pattern}/`))
    .sort((a, b) => b.length - a.length)[0];

  return match ? { pattern: match, roles: ROUTE_ACCESS[match].roles } : null;
}
