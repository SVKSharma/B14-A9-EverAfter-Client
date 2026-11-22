import Link from "next/link";
import {
  ArrowUpRight,
  CalendarCheck,
  Heart,
  ShieldCheck,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { OverviewHeader } from "@/components/dashboard/overview-header";
import { ROLE_LABELS } from "@/lib/constants";
import type { Role, SessionUser } from "@/types";
import { cn } from "@/lib/utils";

interface RolePanel {
  icon: typeof Heart;
  title: string;
  description: string;
  href?: string;
}

const PANELS: Record<Role, RolePanel[]> = {
  customer: [
    {
      icon: Heart,
      title: "Discover services",
      description: "Search approved venues, photographers, florists and more.",
      href: "/services",
    },
    {
      icon: CalendarCheck,
      title: "My bookings",
      description: "Send requests, follow vendor replies and cancel pending ones.",
      href: "/dashboard/customer/bookings",
    },
    {
      icon: Sparkles,
      title: "Your profile",
      description: "Keep your name and photo up to date.",
      href: "/dashboard/profile",
    },
  ],
  vendor: [
    {
      icon: Store,
      title: "My services",
      description: "Create listings, upload photos and manage availability.",
      href: "/dashboard/vendor/services",
    },
    {
      icon: CalendarCheck,
      title: "Booking requests",
      description: "Accept or reject requests from couples.",
      href: "/dashboard/vendor/bookings",
    },
    {
      icon: Wallet,
      title: "Premium plan",
      description: "Upgrade for unlimited services and a premium badge.",
      href: "/dashboard/vendor/subscription",
    },
  ],
  admin: [
    {
      icon: ShieldCheck,
      title: "Manage users",
      description: "Search accounts, filter by role and block abusers.",
      href: "/dashboard/admin/users",
    },
    {
      icon: Store,
      title: "Moderate services",
      description: "Approve, reject or remove vendor listings.",
      href: "/dashboard/admin/services",
    },
    {
      icon: Wallet,
      title: "Transactions",
      description: "Read-only view of plan payments.",
      href: "/dashboard/admin/transactions",
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
      <OverviewHeader
        eyebrow={`${ROLE_LABELS[user.role]} dashboard`}
        title={`Welcome back, ${firstName}`}
        description={ROLE_BLURB[user.role]}
        actions={
          <>
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-5")}
            >
              Browse services
            </Link>
            <Link
              href="/dashboard/profile"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 rounded-full px-5"
              )}
            >
              View profile
            </Link>
          </>
        }
      />

      <section aria-labelledby="workspace-heading" className="space-y-4">
        <h2 id="workspace-heading" className="eyebrow text-muted-foreground">
          Your workspace
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {panels.map((panel) => (
            <Link
              key={panel.title}
              href={panel.href ?? "/dashboard"}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 transition-colors hover:border-white hover:shadow-(--shadow-lift)"
            >
              <div>
                <span className="grid size-10 place-items-center rounded-full border border-border bg-background text-primary">
                  <panel.icon className="size-4" strokeWidth={1.7} />
                </span>
                <h3 className="mt-5 font-heading text-xl tracking-tight text-foreground">
                  {panel.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {panel.description}
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-primary uppercase">
                Open
                <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
