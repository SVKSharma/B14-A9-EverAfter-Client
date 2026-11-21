"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_PATH_BY_ROLE, ROLE_LABELS } from "@/lib/constants";
import { authClient, resetTokenCache } from "@/lib/auth-client";
import type { SessionUser } from "@/types";
import { cn } from "@/lib/utils";

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserMenu({ user, className }: { user: SessionUser; className?: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out. Try again.");
      return;
    }
    resetTokenCache();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex items-center gap-2.5 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-left transition-colors hover:border-foreground/25",
              className
            )}
            aria-label="Account menu"
          >
            <Avatar size="sm" className="size-7">
              {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
              <AvatarFallback className="bg-secondary text-[0.65rem] font-medium text-primary">
                {initials(user.name) || "EA"}
              </AvatarFallback>
            </Avatar>
            <span className="hidden max-w-32 truncate text-[0.8rem] font-medium sm:block">
              {user.name}
            </span>
            <ChevronDown className="size-3 text-muted-foreground" strokeWidth={1.8} />
          </button>
        }
      />

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="px-2.5 py-2">
          <span className="block truncate text-sm font-medium text-foreground">{user.name}</span>
          <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
          <span className="mt-2 inline-flex text-[0.6rem] tracking-[0.16em] text-primary uppercase">
            {ROLE_LABELS[user.role]}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={DASHBOARD_PATH_BY_ROLE[user.role]} />}>
          <LayoutDashboard className="size-4" strokeWidth={1.6} />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
          <UserRound className="size-4" strokeWidth={1.6} />
          Profile
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" strokeWidth={1.6} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
