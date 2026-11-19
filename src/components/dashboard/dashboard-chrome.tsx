"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarHeart,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  Store,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { authClient } from "@/lib/auth-client";
import { DASHBOARD_PATH_BY_ROLE, ROLE_LABELS } from "@/lib/constants";
import type { SessionUser } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

function navItems(user: SessionUser): NavItem[] {
  const items: NavItem[] = [
    { href: DASHBOARD_PATH_BY_ROLE[user.role], label: "Overview", icon: LayoutDashboard },
  ];

  if (user.role === "vendor") {
    items.push({ href: "/dashboard/vendor/services", label: "My services", icon: Store });
    items.push({ href: "/dashboard/vendor/bookings", label: "Booking requests", icon: CalendarCheck });
  }

  if (user.role === "customer") {
    items.push({ href: "/dashboard/customer/bookings", label: "My bookings", icon: CalendarCheck });
  }

  items.push(
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
    { href: "/services", label: "Browse services", icon: Compass }
  );

  return items;
}

function NavLinks({ user, onNavigate }: { user: SessionUser; onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Dashboard navigation">
      {navItems(user).map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              active && "bg-secondary text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardChrome({ user, children }: { user: SessionUser; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out. Try again.");
      return;
    }
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-dvh bg-secondary/20">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/70 bg-background lg:flex">
        <div className="flex h-18 items-center border-b border-border/70 px-6">
          <Logo />
        </div>

        <div className="flex items-center gap-3 border-b border-border/70 px-6 py-5">
          <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavLinks user={user} />
        </div>

        <div className="border-t border-border/70 px-3 py-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu className="size-5" />
            </Button>
            <div className="lg:hidden">
              <Logo />
            </div>
            <p className="hidden text-sm text-muted-foreground lg:block">
              {ROLE_LABELS[user.role]} dashboard
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/services"
              className="hidden items-center gap-1.5 rounded-full border border-border/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:inline-flex"
            >
              <CalendarHeart className="size-3.5" />
              Find services
            </Link>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
          <SheetHeader className="border-b border-border/70 px-6 py-5 text-left">
            <SheetTitle className="font-heading text-2xl font-semibold">EverAfter</SheetTitle>
          </SheetHeader>

          <div className="flex items-center gap-3 border-b border-border/70 px-6 py-4">
            <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user.name.slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex-1 px-3 py-4">
            <NavLinks user={user} onNavigate={() => setMenuOpen(false)} />
          </div>

          <div className="border-t border-border/70 p-4">
            <Button
              variant="outline"
              className="h-10 w-full justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
