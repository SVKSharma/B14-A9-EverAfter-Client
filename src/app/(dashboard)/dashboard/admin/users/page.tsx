import type { Metadata } from "next";
import { AdminUserList, type UserCounts } from "@/components/admin/admin-user-list";
import { PageHeader } from "@/components/shared/page-header";
import { serverApiFetch, serverApiFetchMeta } from "@/lib/server-api";
import type { AdminStats, User } from "@/types";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  const [result, stats] = await Promise.all([
    serverApiFetchMeta<User[]>("/admin/users?limit=50"),
    serverApiFetch<AdminStats>("/admin/stats"),
  ]);

  const users = result?.data ?? [];

  const counts: UserCounts = {
    total: stats?.users.total ?? users.length,
    customers: stats?.users.customers ?? users.filter((user) => user.role === "customer").length,
    vendors: stats?.users.vendors ?? users.filter((user) => user.role === "vendor").length,
    blocked: stats?.users.blocked ?? users.filter((user) => user.isBlocked).length,
    premiumVendors: stats?.subscriptions.premiumVendors ?? 0,
  };

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Admin dashboard", href: "/dashboard/admin" },
          { label: "Users" },
        ]}
        eyebrow="People"
        title="Manage users"
        description="Search accounts, review roles and block anyone abusing the marketplace."
      />

      <AdminUserList
        initialUsers={users}
        initialTotal={(result?.meta?.total as number | undefined) ?? users.length}
        initialCounts={counts}
      />
    </div>
  );
}
