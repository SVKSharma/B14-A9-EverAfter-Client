import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { DASHBOARD_PATH_BY_ROLE } from "@/lib/constants";
import { resolveRouteAccess } from "@/lib/route-access";
import { normalizeRole } from "@/lib/roles";
import type { Role } from "@/types";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * Server-side guard used by the dashboard layout.
 *  - no session        → /sign-in?redirect=<current path>
 *  - blocked account   → /sign-in?blocked=1
 *  - wrong role        → that user's own dashboard
 */
export async function enforceDashboardAccess(): Promise<{
  session: NonNullable<Awaited<ReturnType<typeof getServerSession>>>;
  role: Role;
}> {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "/dashboard";
  const search = headerList.get("x-search") ?? "";

  const session = await getServerSession();

  if (!session) {
    redirect(`/sign-in?redirect=${encodeURIComponent(`${pathname}${search}`)}`);
  }

  const user = session.user as typeof session.user & {
    role?: unknown;
    isBlocked?: boolean;
  };

  if (user.isBlocked) {
    redirect("/sign-in?blocked=1");
  }

  const role = normalizeRole(user.role);
  const access = resolveRouteAccess(pathname);

  if (access && !access.roles.includes(role)) {
    redirect(DASHBOARD_PATH_BY_ROLE[role]);
  }

  return { session, role };
}
