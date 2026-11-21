import type { ReactNode } from "react";
import { DashboardChrome } from "@/components/dashboard/dashboard-chrome";
import { enforceDashboardAccess } from "@/lib/auth-guard";
import { toSessionUser } from "@/lib/session-user";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { session } = await enforceDashboardAccess();
  const user = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);

  return <DashboardChrome user={user}>{children}</DashboardChrome>;
}
