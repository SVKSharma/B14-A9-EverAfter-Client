import { redirect } from "next/navigation";
import { RoleOverview } from "@/components/dashboard/role-overview";
import { getServerSession } from "@/lib/auth-guard";
import { toSessionUser } from "@/lib/session-user";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/admin");

  return <RoleOverview user={toSessionUser(session.user as Parameters<typeof toSessionUser>[0])} />;
}
