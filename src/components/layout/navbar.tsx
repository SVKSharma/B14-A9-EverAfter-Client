"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/layout/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { useSessionUser } from "@/hooks/use-session-user";
import { authClient, resetTokenCache } from "@/lib/auth-client";
import { DASHBOARD_PATH_BY_ROLE, ROLE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse services" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isPending } = useSessionUser();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 16);
        frame = 0;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error) {
      toast.error(error.message ?? "Could not sign out. Try again.");
      return;
    }
    resetTokenCache();
    setOpen(false);
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-7 lg:px-8">
        <Logo />

        <nav
          className="glass hidden items-center gap-1 rounded-full px-2 py-1.5 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative rounded-full px-4 py-2 text-[0.75rem] tracking-[0.1em] text-muted-foreground uppercase transition-colors hover:text-foreground",
                isActive(pathname, link.href) && "bg-foreground/[0.06] text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isPending ? (
            <Skeleton className="h-9 w-32 rounded-full" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-[0.78rem] tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "default" }), "h-10 rounded-full px-5")}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-10 md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" strokeWidth={1.5} />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
          <SheetHeader className="border-b border-border px-6 py-5 text-left">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Logo compact />
          </SheetHeader>

          {user ? (
            <div className="flex items-center gap-3 border-b border-border px-6 py-4">
              <span className="grid size-10 place-items-center rounded-full border border-border bg-secondary font-heading text-sm text-primary">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-[0.7rem] tracking-[0.1em] text-muted-foreground uppercase">
                  {ROLE_LABELS[user.role]}
                </p>
              </div>
            </div>
          ) : null}

          <nav className="flex flex-1 flex-col px-6 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "border-b border-border/70 py-4 font-heading text-2xl tracking-tight transition-colors",
                  isActive(pathname, link.href) ? "text-primary" : "text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  href={DASHBOARD_PATH_BY_ROLE[user.role]}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-border/70 py-4 text-sm text-foreground"
                >
                  <LayoutDashboard className="size-4 text-muted-foreground" strokeWidth={1.6} />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 border-b border-border/70 py-4 text-sm text-foreground"
                >
                  <UserRound className="size-4 text-muted-foreground" strokeWidth={1.6} />
                  Profile
                </Link>
              </>
            ) : null}
          </nav>

          <div className="mt-auto flex flex-col gap-2 border-t border-border p-6">
            {user ? (
              <>
                <Link
                  href={DASHBOARD_PATH_BY_ROLE[user.role]}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  Go to dashboard
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4" strokeWidth={1.6} />
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  Get started
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full")}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
