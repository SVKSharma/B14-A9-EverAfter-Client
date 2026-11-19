"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Search, ShieldOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { apiFetch, apiFetchPage, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface AdminUsersProps {
  initialUsers: User[];
  initialTotal: number;
}

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-plum text-white",
  vendor: "bg-primary/10 text-primary",
  customer: "bg-secondary text-foreground",
};

export function AdminUserList({ initialUsers, initialTotal }: AdminUsersProps) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [pendingBlock, setPendingBlock] = useState<User | null>(null);

  const load = async (nextSearch = search, nextRole = role) => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({ limit: "50" });
      if (nextSearch.trim()) params.set("search", nextSearch.trim());
      if (nextRole !== "all") params.set("role", nextRole);

      const page = await apiFetchPage<User[]>(`/admin/users?${params.toString()}`);
      setUsers(page.data);
      setTotal(page.meta?.total ?? page.data.length);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const confirmBlockChange = async () => {
    if (!pendingBlock) return;
    const nextBlocked = !pendingBlock.isBlocked;
    const id = pendingBlock.id;
    setBusyId(id);

    try {
      await apiFetch(`/admin/users/${id}/block`, {
        method: "PATCH",
        body: { isBlocked: nextBlocked },
      });

      setUsers((current) =>
        current.map((item) => (item.id === id ? { ...item, isBlocked: nextBlocked } : item))
      );
      toast.success(nextBlocked ? "Account blocked" : "Account unblocked");
      setPendingBlock(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or business"
            className="h-10 pl-9"
            aria-label="Search users"
          />
        </form>

        <Select
          value={role}
          onValueChange={(value) => {
            const next = value ?? "all";
            setRole(next);
            void load(search, next);
          }}
        >
          <SelectTrigger className="h-10 w-full sm:w-44" aria-label="Filter by role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLE_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-muted-foreground">
        {isLoading ? "Loading accounts…" : `${total} account${total === 1 ? "" : "s"}`}
      </p>

      {users.length === 0 && !isLoading ? (
        <EmptyState
          icon={Search}
          title="No accounts match"
          description="Try a different search term or role filter."
        />
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <Card key={user.id} className="border-border/80">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-secondary">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-sm font-semibold text-primary">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{user.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                        ROLE_STYLES[user.role]
                      )}
                    >
                      {user.role}
                    </span>
                    {user.isBlocked ? (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-medium text-destructive">
                        Blocked
                      </span>
                    ) : null}
                    {user.subscriptionPlan === "premium" ? (
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[11px] font-medium text-plum dark:text-gold">
                        Premium
                      </span>
                    ) : null}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                    {user.businessName ? ` · ${user.businessName}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden text-xs text-muted-foreground sm:block">
                    Joined {formatDate(user.createdAt)}
                  </span>
                  <Link
                    href={`/dashboard/admin/users/${user.id}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Details
                  </Link>
                  {user.role === "admin" ? (
                    <span className="text-xs text-muted-foreground">Admin</span>
                  ) : (
                    <Button
                      variant={user.isBlocked ? "outline" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-8 gap-1.5",
                        !user.isBlocked && "text-destructive hover:text-destructive"
                      )}
                      onClick={() => setPendingBlock(user)}
                      disabled={busyId === user.id}
                    >
                      {busyId === user.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : user.isBlocked ? (
                        <ShieldCheck className="size-3.5" />
                      ) : (
                        <ShieldOff className="size-3.5" />
                      )}
                      {user.isBlocked ? "Unblock" : "Block"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={Boolean(pendingBlock)}
        onOpenChange={(open) => (!open ? setPendingBlock(null) : null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingBlock?.isBlocked ? "Unblock this account?" : "Block this account?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingBlock?.isBlocked
                ? `${pendingBlock?.name} will be able to sign in and use the marketplace again.`
                : `${pendingBlock?.name} will lose access immediately and all their sessions will be revoked.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(busyId)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmBlockChange();
              }}
              disabled={Boolean(busyId)}
            >
              {busyId ? <Loader2 className="size-4 animate-spin" /> : null}
              {pendingBlock?.isBlocked ? "Unblock" : "Block account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
