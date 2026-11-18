"use client";

import { useEffect, useState } from "react";
import { CloudOff, Sparkles } from "lucide-react";
import { apiFetch, ApiError, getErrorMessage } from "@/lib/api";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types";

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

export function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await apiFetch<Service[]>("/services?limit=6&sort=newest", {
          signal: controller.signal,
        });
        if (!controller.signal.aborted) setServices(data ?? []);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        if (requestError instanceof ApiError && requestError.status === 404) {
          setServices([]);
          return;
        }
        setError(getErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => {
    setIsLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={CloudOff}
        title="We couldn't load featured services"
        description={error}
        action={
          <Button size="lg" className="h-10 px-5" onClick={retry}>
            Try again
          </Button>
        }
      />
    );
  }

  if (services.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Beautiful services are on their way"
        description="Our vendors are putting the finishing touches on their listings. Check back soon to discover your dream team."
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} />
      ))}
    </div>
  );
}
