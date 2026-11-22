"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CloudOff,
  MapPin,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { apiFetchPage, ApiError, buildQuery, getErrorMessage } from "@/lib/api";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceCardSkeleton } from "@/components/shared/page-skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
  return <ServiceCardSkeleton />;
}

const selectClassName =
  "h-11 w-full appearance-none rounded-full border border-input bg-card/80 px-4 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-55";

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
      <div className="mb-8">
        <div className="glass-strong rounded-2xl p-3.5 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search services by name"
                aria-label="Search services by name"
                className="h-11 rounded-full border-white/60 bg-white/70 pl-11"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={locationInput}
                  onChange={(event) => handleLocationChange(event.target.value)}
                  placeholder="Any location"
                  aria-label="Filter by location"
                  className="h-11 rounded-full border-white/60 bg-white/70 pl-11 sm:w-40"
                />
              </div>

              <div className="relative">
                <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={sort}
                  onChange={(event) => handleSelectChange("sort", event.target.value)}
                  aria-label="Sort services"
                  className={cn(selectClassName, "pl-11 sm:w-40")}
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="pointer-events-none absolute right-4 top-1/2 size-3.5 -translate-y-1/2 rotate-90 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <button
              type="button"
              onClick={() => handleSelectChange("category", "")}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase transition-colors",
                category === ""
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
              )}
            >
              All
            </button>
            {CATEGORIES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelectChange("category", item.value)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-[0.7rem] tracking-[0.1em] uppercase transition-colors",
                  category === item.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Finding services…" : `${total} ${total === 1 ? "service" : "services"}`}
          </p>
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
          {activeFilters.length > 0 ? (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[0.7rem] tracking-[0.12em] text-primary uppercase underline-offset-4 hover:underline"
            >
              Clear all
            </button>
          ) : null}
        </div>
        {totalPages > 1 ? (
          <p className="text-xs tracking-[0.1em] text-muted-foreground uppercase">
            Page {page} of {totalPages}
          </p>
        ) : null}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              <Button size="lg" className="h-11 rounded-full px-6" onClick={retry}>
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
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 rounded-full px-6"
                  onClick={clearFilters}
                >
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>

      {!isLoading && !error && totalPages > 1 ? (
        <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
          <Button
            variant="outline"
            className="h-10 gap-1.5 rounded-full px-4"
            disabled={page <= 1}
            onClick={() => goToPage(page - 1)}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === page ? "default" : "ghost"}
                  size="icon"
                  className="size-9 rounded-full"
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
            className="h-10 gap-1.5 rounded-full px-4"
            disabled={page >= totalPages}
            onClick={() => goToPage(page + 1)}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
