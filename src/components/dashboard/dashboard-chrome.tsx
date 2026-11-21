"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Crown,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  ShieldCheck,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { authClient, resetTokenCache } from "@/lib/auth-client";
import { DASHBOARD_PATH_BY_ROLE, ROLE_LABELS } from "@/lib/constants";
import type { SessionUser } from "@/types";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

function navSections(user: SessionUser): NavSection[] {
  const workspace: NavItem[] = [
    { href: DASHBOARD_PATH_BY_ROLE[user.role], label: "Overview", icon: LayoutDashboard },
  ];

  const manage: NavItem[] = [];

  if (user.role === "vendor") {
    manage.push({ href: "/dashboard/vendor/services", label: "My services", icon: Store });
    manage.push({
      href: "/dashboard/vendor/bookings",
      label: "Booking requests",
      icon: CalendarCheck,
    });
    manage.push({ href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown });
  }

  if (user.role === "customer") {
    manage.push({ href: "/dashboard/customer/bookings", label: "My bookings", icon: CalendarCheck });
  }

  if (user.role === "admin") {
    manage.push(
      { href: "/dashboard/admin/users", label: "Manage users", icon: Users },
      { href: "/dashboard/admin/services", label: "Moderate services", icon: ShieldCheck },
      { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt }
    );
  }

  manage.push({ href: "/dashboard/profile", label: "Profile", icon: UserRound });

  return [
    { label: "Workspace", items: workspace },
    { label: "Manage", items: manage },
  ];
}

function NavLinks({ user, onNavigate }: { user: SessionUser; onNavigate?: () => void }) {
  const pathname = usePathname();
  const sections = navSections(user);

  return (
    <nav className="flex flex-col gap-6" aria-label="Dashboard navigation">
      {sections.map((section) => (
        <div key={section.label}>
          <p className="px-3 text-[0.6rem] tracking-[0.18em] text-muted-foreground/70 uppercase">
            {section.label}
          </p>
          <div className="mt-2 flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg py-2.5 pl-3.5 pr-3 text-sm transition-colors",
                    active
                      ? "bg-primary/[0.07] font-medium text-foreground"
                      : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-y-1.5 left-0 w-[3px] rounded-full bg-gold transition-opacity",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <item.icon
                    className={cn("size-4 shrink-0", active ? "text-primary" : "text-muted-foreground/80")}
                    strokeWidth={1.7}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function UserCard({ user }: { user: SessionUser }) {
  return (
    <div className="flex items-center gap-3 px-2 py-2">
      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-secondary font-heading text-sm text-primary">
        {user.name.slice(0, 1).toUpperCase()}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
        <p className="truncate text-[0.65rem] tracking-[0.1em] text-muted-foreground uppercase">
          {ROLE_LABELS[user.role]}
        </p>
      </div>
    </div>
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
    resetTokenCache();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-dvh">
      <div className="mesh pointer-events-none fixed inset-x-0 top-0 h-96 opacity-40" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-border/70 bg-card/60 backdrop-blur-xl lg:flex">
        <div className="flex h-18 items-center border-b border-border/70 px-6">
          <Logo />
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className="mb-6 rounded-xl border border-border/70 bg-background/60 p-2">
            <UserCard user={user} />
          </div>

          <NavLinks user={user} />
        </div>

        <div className="border-t border-border/70 p-3">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-destructive/[0.07] hover:text-destructive"
          >
            <LogOut className="size-4" strokeWidth={1.7} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="relative flex min-h-dvh flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-10 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open dashboard menu"
            >
              <Menu className="size-5" strokeWidth={1.7} />
            </Button>
            <div className="lg:hidden">
              <Logo compact />
            </div>
            <span className="hidden items-center gap-2 lg:flex">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
                {ROLE_LABELS[user.role]}
              </span>
              <span className="text-[0.7rem] text-muted-foreground/60">/</span>
              <span className="text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
                Dashboard
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/services"
              className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:border-foreground/25 hover:text-foreground sm:inline-flex"
            >
              Browse services
            </Link>
            <UserMenu user={user} />
          </div>
        </header>

        <main className="flex-1 px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[85vw] max-w-sm gap-0 p-0">
          <SheetHeader className="border-b border-border/70 px-6 py-5 text-left">
            <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
            <Logo compact />
          </SheetHeader>

          <div className="border-b border-border/70 px-5 py-4">
            <UserCard user={user} />
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-5">
            <NavLinks user={user} onNavigate={() => setMenuOpen(false)} />
          </div>

          <div className="border-t border-border/70 p-4">
            <Button
              variant="outline"
              className="h-11 w-full justify-start gap-2 rounded-full text-destructive hover:text-destructive"
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
