"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, CloudOff, MapPin, Search, SearchX, SlidersHorizontal, X } from "lucide-react";
import { apiFetchPage, ApiError, buildQuery, getErrorMessage } from "@/lib/api";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { PaginationMeta, Service } from "@/types";

const PAGE_SIZE = 6;
const SEARCH_DEBOUNCE_MS = 400;

export interface BrowseFilters {
  search: string;
  category: string;
  location: string;
  sort: string;
  page: number;
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card">
      <Skeleton className="aspect-4/3 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-2/5" />
        <div className="flex items-center justify-between border-t border-border/70 pt-4">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}

const selectClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm text-foreground shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function BrowseServices({ initialFilters }: { initialFilters: BrowseFilters }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const location = searchParams.get("location") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const query = useMemo(
    () =>
      buildQuery({
        search,
        category,
        location,
        sort,
        page,
        limit: PAGE_SIZE,
      }),
    [search, category, location, sort, page]
  );

  const [searchInput, setSearchInput] = useState(initialFilters.search);
  const [locationInput, setLocationInput] = useState(initialFilters.location);
  const [services, setServices] = useState<Service[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateParams = useCallback(
    (updates: Record<string, string | number | null>, options?: { keepScroll?: boolean }) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "" || (key === "page" && Number(value) === 1)) {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      const queryString = next.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: options?.keepScroll ? false : undefined,
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const load = async () => {
      try {
        const result = await apiFetchPage<Service[]>(`/services${query}`, {
          auth: false,
          signal: controller.signal,
        });
        if (!active) return;
        setServices(result.data ?? []);
        setMeta(result.meta);
        setError(null);
      } catch (requestError) {
        if (!active || controller.signal.aborted) return;
        if (requestError instanceof ApiError && requestError.status === 404) {
          setServices([]);
          setMeta(undefined);
          return;
        }
        setError(getErrorMessage(requestError));
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [query, reloadKey]);

  useEffect(() => {
    if (!meta || meta.totalPages === 0 || page <= meta.totalPages) return;
    updateParams({ page: meta.totalPages }, { keepScroll: true });
  }, [meta, page, updateParams]);

  useEffect(() => {
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
      if (locationTimer.current) clearTimeout(locationTimer.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setIsLoading(true);
      updateParams({ search: value, page: null }, { keepScroll: true });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleLocationChange = (value: string) => {
    setLocationInput(value);
    if (locationTimer.current) clearTimeout(locationTimer.current);
    locationTimer.current = setTimeout(() => {
      setIsLoading(true);
      updateParams({ location: value, page: null }, { keepScroll: true });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleSelectChange = (key: "category" | "sort", value: string) => {
    setIsLoading(true);
    updateParams({ [key]: value, page: null }, { keepScroll: true });
  };

  const clearFilters = () => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (locationTimer.current) clearTimeout(locationTimer.current);
    setSearchInput("");
    setLocationInput("");
    setIsLoading(true);
    router.replace(pathname, { scroll: false });
  };

  const goToPage = (nextPage: number) => {
    setIsLoading(true);
    updateParams({ page: nextPage === 1 ? null : nextPage });
  };

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  const activeFilters = [
    search ? { key: "search", label: `“${search}”` } : null,
    category
      ? {
          key: "category",
          label: CATEGORIES.find((item) => item.value === category)?.label ?? category,
        }
      : null,
    location ? { key: "location", label: location } : null,
  ].filter((item): item is { key: string; label: string } => item !== null);

  const total = meta?.total ?? services.length;
  const totalPages = meta?.totalPages ?? 0;

  return (
    <div>
      <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="size-4 text-primary/70" />
            Search &amp; filters
          </p>
          {activeFilters.length > 0 ? (
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-muted-foreground" onClick={clearFilters}>
              <X className="size-3.5" />
              Clear all
            </Button>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search services by name"
              aria-label="Search services by name"
              className="h-11 bg-background pl-10"
            />
          </div>

          <select
            value={category}
            onChange={(event) => handleSelectChange("category", event.target.value)}
            aria-label="Filter by category"
            className={selectClassName}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={locationInput}
              onChange={(event) => handleLocationChange(event.target.value)}
              placeholder="Any location"
              aria-label="Filter by location"
              className="h-11 bg-background pl-10"
            />
          </div>

          <select
            value={sort}
            onChange={(event) => handleSelectChange("sort", event.target.value)}
            aria-label="Sort services"
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {activeFilters.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Active
            </span>
            {activeFilters.map((filter) => (
              <Badge key={filter.key} variant="secondary" className="gap-1.5 py-1 pl-2.5 pr-1.5">
                {filter.label}
                <button
                  type="button"
                  onClick={() => {
                    if (filter.key === "search") setSearchInput("");
                    if (filter.key === "location") setLocationInput("");
                    setIsLoading(true);
                    updateParams({ [filter.key]: null, page: null }, { keepScroll: true });
                  }}
                  aria-label={`Remove ${filter.key} filter`}
                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-8 flex items-baseline justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {isLoading ? "Finding services…" : `${total} ${total === 1 ? "service" : "services"} found`}
        </p>
        {totalPages > 1 ? (
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        ) : null}
      </div>

      <div className="mt-5">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <EmptyState
            icon={CloudOff}
            title="We couldn't load these services"
            description={error}
            action={
              <Button size="lg" className="h-10 px-5" onClick={retry}>
                Try again
              </Button>
            }
          />
        ) : services.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No services match your search"
            description="Try a different name, category, or location — or clear your filters to see everything available."
            action={
              activeFilters.length > 0 ? (
                <Button variant="outline" size="lg" className="h-10 px-5" onClick={clearFilters}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>

      {!isLoading && !error && totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="outline"
            className="h-10 gap-1.5 px-4"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "ghost"}
                  size="icon"
                  className="size-10"
                  onClick={() => goToPage(pageNumber)}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={pageNumber === page ? "page" : undefined}
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            className="h-10 gap-1.5 px-4"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
