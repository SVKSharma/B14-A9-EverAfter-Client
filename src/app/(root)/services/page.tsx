import type { Metadata } from "next";
import Link from "next/link";
import { BrowseServices, type BrowseFilters } from "@/components/services/browse-services";

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

export default async function BrowseServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const filters: BrowseFilters = {
    search: firstValue(params.search),
    category: firstValue(params.category),
    location: firstValue(params.location),
    sort: firstValue(params.sort) || "newest",
    page: Math.max(1, Number(firstValue(params.page)) || 1),
  };

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="mesh pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-14 sm:px-7 lg:px-8 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
              <li>
                <Link href="/" className="transition-colors hover:text-foreground">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-foreground">Services</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <p className="eyebrow text-primary">The collection</p>
            <h1 className="mt-4 font-heading text-[2.4rem] leading-[1.08] tracking-[-0.015em] sm:text-[3.2rem]">
              Find your wedding
              <br />
              <em className="italic text-primary">dream team.</em>
            </h1>
            <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
              Every studio here has been reviewed before publishing. Filter by discipline,
              location or price, and enquire with the ones that feel like you.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-7 lg:px-8 lg:py-14">
        <BrowseServices initialFilters={filters} />
      </div>
    </div>
  );
}
