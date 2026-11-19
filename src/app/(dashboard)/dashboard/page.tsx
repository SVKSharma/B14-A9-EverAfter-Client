import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-guard";
import { DASHBOARD_PATH_BY_ROLE } from "@/lib/constants";
import { normalizeRole } from "@/lib/roles";

export default async function DashboardIndexPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in?redirect=/dashboard");
  }

  redirect(DASHBOARD_PATH_BY_ROLE[normalizeRole((session.user as { role?: unknown }).role)]);
}
