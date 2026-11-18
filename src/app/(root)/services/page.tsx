import type { Metadata } from "next";
import { BrowseServices, type BrowseFilters } from "@/components/services/browse-services";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Browse Services",
  description:
    "Explore approved wedding venues, photographers, florists, caterers, makeup artists, and fashion services on EverAfter.",
};

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function BrowseServicesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const filters: BrowseFilters = {
    search: firstValue(params.search),
    category: firstValue(params.category),
    location: firstValue(params.location),
    sort: firstValue(params.sort) || "newest",
    page: Math.max(1, Number(firstValue(params.page)) || 1),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Browse services"
        title="Find your wedding dream team"
        description="Search by name, filter by category or location, and sort by price to find the perfect fit for your day."
      />

      <div className="mt-10">
        <BrowseServices initialFilters={filters} />
      </div>
    </div>
  );
}
