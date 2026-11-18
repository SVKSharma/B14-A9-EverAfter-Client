import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { EmptyState } from "@/components/shared/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Explore approved wedding venues, photographers, florists, caterers, makeup artists, and fashion services on EverAfter.",
};

export default function BrowseServicesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="Browse services"
          title="Find your wedding dream team"
          description="Search by name, filter by category or location, and sort by price to find the perfect fit for your day."
        />
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Search className="size-4 text-primary/70" />
            Search & filters
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4 text-primary/70" />
            Local vendors
          </span>
        </div>
      </div>

      <div className="mt-10 grid gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {["Search services", "All categories", "Any location", "Newest first"].map((label) => (
          <div
            key={label}
            className="flex h-11 items-center rounded-lg border border-input bg-background px-3.5 text-sm text-muted-foreground/70"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="mt-10">
        <EmptyState
          icon={Heart}
          title="Our first services are being prepared"
          description="Approved vendor services will appear here as soon as they go live. Filters and sorting are ready to help you find the right fit."
          action={
            <Link
              href="/sign-up?role=vendor"
              className={cn(buttonVariants({ size: "lg" }), "h-10 gap-2 px-5")}
            >
              List your service
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </div>
    </div>
  );
}
