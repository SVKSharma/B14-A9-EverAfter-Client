"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpRight, Loader2, Search, ShieldCheck, ShieldOff, Users } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { StatCard, StatStrip } from "@/components/shared/stat-card";
import { apiFetch, apiFetchPage, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/types";

export interface UserCounts {
  total: number;
  customers: number;
  vendors: number;
  blocked: number;
  premiumVendors: number;
}

interface AdminUsersProps {
  initialUsers: User[];
  initialTotal: number;
  initialCounts: UserCounts;
}

const ROLE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "customer", label: "Customers" },
  { value: "vendor", label: "Vendors" },
  { value: "admin", label: "Admins" },
];

const ROLE_CHIP: Record<Role, string> = {
  admin: "border-primary/25 bg-primary/[0.07] text-primary",
  vendor: "border-[#8ba185]/45 bg-[#a0aa96]/12 text-[#4f6b52]",
  customer: "border-border bg-background/70 text-muted-foreground",
};

export function AdminUserList({ initialUsers, initialTotal, initialCounts }: AdminUsersProps) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [counts, setCounts] = useState(initialCounts);
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
      setCounts((current) => ({
        ...current,
        blocked: Math.max(0, current.blocked + (nextBlocked ? 1 : -1)),
      }));
      toast.success(nextBlocked ? "Account blocked" : "Account unblocked");
      setPendingBlock(null);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setBusyId(null);
    }
  };

  const isFiltered = search.trim().length > 0 || role !== "all";
  const visibleCount = useMemo(() => users.length, [users]);

  return (
    <div className="space-y-6">
      <StatStrip className="xl:grid-cols-3">
        <StatCard
          icon={Users}
          label="Accounts"
          value={counts.total}
          hint={`${counts.customers} customers · ${counts.vendors} vendors`}
          tone="primary"
        />
        <StatCard
          icon={ShieldOff}
          label="Blocked"
          value={counts.blocked}
          hint="Signed out and locked out"
          tone={counts.blocked > 0 ? "warning" : "default"}
        />
        <StatCard
          icon={ShieldCheck}
          label="Premium vendors"
          value={counts.premiumVendors}
          hint="Unlimited listings"
          tone="success"
        />
      </StatStrip>

      <div className="flex flex-col gap-3">
        <form
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            void load();
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or business"
            aria-label="Search users"
            className="h-11 w-full rounded-full border border-input bg-card/80 pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/80 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/15"
          />
        </form>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ROLE_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setRole(option.value);
                void load(search, option.value);
              }}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase transition-colors",
                role === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Loading accounts…"
            : `${total} account${total === 1 ? "" : "s"}${isFiltered ? ` · ${visibleCount} shown` : ""}`}
        </p>
        {isFiltered ? (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setRole("all");
              void load("", "all");
            }}
            className="text-[0.7rem] tracking-[0.12em] text-primary uppercase underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {users.length === 0 && !isLoading ? (
        <EmptyState
          icon={Search}
          title="No accounts match"
          description="Try a different search term or role filter."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl">
          <ul className="divide-y divide-border/70">
            {users.map((user) => (
              <li
                key={user.id}
                className={cn(
                  "flex flex-col gap-4 px-4 py-4 transition-colors hover:bg-background/40 sm:px-5 sm:py-5 lg:flex-row lg:items-center",
                  user.isBlocked && "bg-destructive/[0.025]"
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-border/60">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="grid h-full place-items-center font-heading text-base text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-medium text-foreground">{user.name}</p>
                      <span
                        className={cn(
                          "inline-flex h-5.5 items-center rounded-full border px-2 text-[0.58rem] tracking-[0.12em] uppercase",
                          user.isBlocked
                            ? "border-destructive/30 bg-destructive/[0.07] text-destructive"
                            : ROLE_CHIP[user.role]
                        )}
                      >
                        {user.isBlocked ? "Blocked" : user.role}
                      </span>
                      {user.subscriptionPlan === "premium" ? (
                        <span className="inline-flex h-5.5 items-center rounded-full border border-gold/40 bg-gold/[0.12] px-2 text-[0.58rem] tracking-[0.12em] text-[#8a6c3a] uppercase">
                          Premium
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {user.email}
                      {user.businessName ? ` · ${user.businessName}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
                  <span className="mr-1 hidden text-[0.7rem] text-muted-foreground sm:inline">
                    Joined {formatDate(user.createdAt)}
                  </span>
                  <Link
                    href={`/dashboard/admin/users/${user.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "h-9 gap-1.5 rounded-full px-4"
                    )}
                  >
                    Details
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                  {user.role === "admin" ? (
                    <span className="inline-flex h-9 items-center rounded-full border border-border/70 bg-background/60 px-4 text-[0.68rem] tracking-[0.1em] text-muted-foreground uppercase">
                      Protected
                    </span>
                  ) : (
                    <Button
                      variant={user.isBlocked ? "outline" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-9 gap-1.5 rounded-full px-4",
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
              </li>
            ))}
          </ul>
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
              variant={pendingBlock?.isBlocked ? "default" : "destructive"}
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
