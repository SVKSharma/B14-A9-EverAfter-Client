import type { Metadata } from "next";
import Link from "next/link";
import { AdminUserList } from "@/components/admin/admin-user-list";
import { serverApiFetchMeta } from "@/lib/server-api";
import type { User } from "@/types";

export const metadata: Metadata = { title: "Manage Users" };

export default async function AdminUsersPage() {
  const result = await serverApiFetchMeta<User[]>("/admin/users?limit=50");

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/admin" className="hover:text-foreground">
          Admin dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Users</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Manage users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search accounts, review roles and block anyone abusing the marketplace.
        </p>
      </div>

      <AdminUserList
        initialUsers={result?.data ?? []}
        initialTotal={(result?.meta?.total as number | undefined) ?? result?.data.length ?? 0}
      />
    </div>
  );
}
