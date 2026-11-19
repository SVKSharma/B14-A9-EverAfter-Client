import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Heart,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role, SessionUser } from "@/types";
import { cn } from "@/lib/utils";

interface RolePanel {
  icon: typeof Heart;
  title: string;
  description: string;
  status: "ready" | "next";
  href?: string;
}

const PANELS: Record<Role, RolePanel[]> = {
  customer: [
    {
      icon: Heart,
      title: "Discover services",
      description: "Search approved venues, photographers, florists and more.",
      status: "ready",
      href: "/services",
    },
    {
      icon: CalendarCheck,
      title: "My bookings",
      description: "Send requests, follow vendor replies and cancel pending ones.",
      status: "ready",
      href: "/dashboard/customer/bookings",
    },
    {
      icon: Sparkles,
      title: "Your profile",
      description: "Keep your name and photo up to date.",
      status: "ready",
      href: "/dashboard/profile",
    },
  ],
  vendor: [
    {
      icon: Store,
      title: "My services",
      description: "Create listings, upload photos and manage availability.",
      status: "ready",
      href: "/dashboard/vendor/services",
    },
    {
      icon: CalendarCheck,
      title: "Booking requests",
      description: "Accept or reject requests from couples.",
      status: "ready",
      href: "/dashboard/vendor/bookings",
    },
    {
      icon: Wallet,
      title: "Premium plan",
      description: "Upgrade for unlimited services and a premium badge.",
      status: "next",
    },
  ],
  admin: [
    {
      icon: ShieldCheck,
      title: "Manage users",
      description: "Search accounts, filter by role and block abusers.",
      status: "next",
    },
    {
      icon: Store,
      title: "Moderate services",
      description: "Approve, reject or remove vendor listings.",
      status: "next",
    },
    {
      icon: Wallet,
      title: "Transactions",
      description: "Read-only view of plan payments.",
      status: "next",
    },
  ],
};

const ROLE_BLURB: Record<Role, string> = {
  customer: "Plan your day, request bookings and keep everything in one calm place.",
  vendor: "Showcase your services and turn enquiries into confirmed bookings.",
  admin: "Keep the marketplace trustworthy and running smoothly.",
};

export function RoleOverview({ user }: { user: SessionUser }) {
  const firstName = user.name.split(/\s+/)[0] || "there";
  const panels = PANELS[user.role];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-plum px-6 py-10 text-white shadow-lg sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-gold/20 blur-2xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            {ROLE_LABELS[user.role]} dashboard
          </p>
          <h1 className="mt-3 font-heading text-4xl font-semibold leading-tight sm:text-5xl">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
            {ROLE_BLURB[user.role]}
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/services"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 gap-2 bg-background px-5 text-foreground hover:bg-background/90"
              )}
            >
              Browse services
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              View profile
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="workspace-heading" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="workspace-heading" className="font-heading text-2xl font-semibold">
              Your workspace
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Features unlock as each phase lands. Nothing here is decorative.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {panels.map((panel) => {
            const content = (
              <Card
                className={cn(
                  "h-full border-border/80 transition-all",
                  panel.status === "ready" && "hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                      <panel.icon className="size-5" strokeWidth={1.7} />
                    </span>
                    <Badge variant={panel.status === "ready" ? "secondary" : "outline"}>
                      {panel.status === "ready" ? "Ready" : "Next phase"}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="font-heading text-xl">{panel.title}</CardTitle>
                    <CardDescription className="mt-1.5">{panel.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  {panel.href ? (
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                      Open
                      <ArrowRight className="size-3.5" />
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Coming in the next build step
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            return panel.href ? (
              <Link key={panel.title} href={panel.href} className="block">
                {content}
              </Link>
            ) : (
              <div key={panel.title}>{content}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
