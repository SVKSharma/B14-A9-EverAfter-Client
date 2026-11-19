import { redirect } from "next/navigation";
import { CustomerOverview } from "@/components/dashboard/customer-overview";
import { RoleOverview } from "@/components/dashboard/role-overview";
import { getServerSession } from "@/lib/auth-guard";
import { serverApiFetch } from "@/lib/server-api";
import { toSessionUser } from "@/lib/session-user";
import type { CustomerStats } from "@/types";

export const metadata = { title: "Customer Dashboard" };

export default async function CustomerDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/customer");

  const user = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);
  const stats = await serverApiFetch<CustomerStats>("/stats/customer");

  if (!stats) {
    return <RoleOverview user={user} />;
  }

  return <CustomerOverview stats={stats} name={user.name} />;
}
