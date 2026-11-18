"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/layout/logo";
import { useSessionUser } from "@/hooks/use-session-user";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const { user } = useSessionUser();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                isActive(pathname, link.href) && "bg-secondary/80 text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <Link
              href={`/dashboard/${user.role}`}
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 px-4")}
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "lg" }), "h-10 px-5 shadow-sm")}
              >
                Get Started
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
          <Menu className="size-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-[85vw] max-w-sm gap-0 p-0">
          <SheetHeader className="border-b border-border/70 px-6 py-5 text-left">
            <SheetTitle className="font-heading text-2xl font-semibold">EverAfter</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
                  isActive(pathname, link.href) && "bg-secondary text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto flex flex-col gap-2 border-t border-border/70 p-6">
            {user ? (
              <Link
                href={`/dashboard/${user.role}`}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-up"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "h-11 w-full")}
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 w-full")}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
