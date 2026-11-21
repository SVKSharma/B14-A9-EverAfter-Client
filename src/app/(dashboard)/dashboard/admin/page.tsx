import { redirect } from "next/navigation";
import { AdminOverview } from "@/components/admin/admin-overview";
import { RoleOverview } from "@/components/dashboard/role-overview";
import { getServerSession } from "@/lib/auth-guard";
import { serverApiFetch } from "@/lib/server-api";
import { toSessionUser } from "@/lib/session-user";
import type { AdminStats } from "@/types";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/admin");

  const user = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);
  const stats = await serverApiFetch<AdminStats>("/admin/stats");

  if (!stats) {
    return <RoleOverview user={user} />;
  }

  return <AdminOverview stats={stats} name={user.name} />;
}
