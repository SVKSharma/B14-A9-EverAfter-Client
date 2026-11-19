import { redirect } from "next/navigation";
import { RoleOverview } from "@/components/dashboard/role-overview";
import { getServerSession } from "@/lib/auth-guard";
import { toSessionUser } from "@/lib/session-user";

export const metadata = { title: "Vendor Dashboard" };

export default async function VendorDashboardPage() {
  const session = await getServerSession();
  if (!session) redirect("/sign-in?redirect=/dashboard/vendor");

  return <RoleOverview user={toSessionUser(session.user as Parameters<typeof toSessionUser>[0])} />;
}
