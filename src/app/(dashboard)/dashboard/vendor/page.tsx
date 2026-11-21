import { redirect } from "next/navigation";
import { RoleOverview } from "@/components/dashboard/role-overview";
import { VendorOverview } from "@/components/dashboard/vendor-overview";
import { getServerSession } from "@/lib/auth-guard";
import { serverApiFetch } from "@/lib/server-api";
import { toSessionUser } from "@/lib/session-user";
import type { VendorStats } from "@/types";

export const metadata = { title: "Vendor Dashboard" };

export default async function VendorDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/vendor");

  const user = toSessionUser(session.user as Parameters<typeof toSessionUser>[0]);
  const stats = await serverApiFetch<VendorStats>("/stats/vendor");

  if (!stats) {
    return <RoleOverview user={user} />;
  }

  return <VendorOverview stats={stats} name={user.name} />;
}
