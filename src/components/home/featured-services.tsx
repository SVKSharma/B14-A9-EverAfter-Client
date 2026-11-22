"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CloudOff, Sparkles } from "lucide-react";
import { apiFetch, ApiError, getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getCategoryLabel } from "@/lib/constants";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { FeaturedServicesSkeleton } from "@/components/shared/page-skeletons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

export function FeaturedServices({ className }: { className?: string }) {
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
    return <FeaturedServicesSkeleton className={className} />;
  }

  if (error) {
    return (
      <EmptyState
        icon={CloudOff}
        title="We couldn't load featured services"
        description={error}
        action={
          <Button size="lg" onClick={retry}>
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

  const [lead, ...rest] = services;

  return (
    <div
      className={cn("grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10", className)}
    >
      <div className="min-w-0">
        <ServiceCard service={lead} />
      </div>

      <div className="flex min-w-0 flex-col gap-3">
        {rest.map((service) => (
          <FeaturedRow key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}

function FeaturedRow({ service }: { service: Service }) {
  const vendorName = service.vendor?.businessName || service.vendor?.name || "EverAfter vendor";

  return (
    <Link
      href={`/services/${service._id}`}
      className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-border/70 bg-card/70 p-3 outline-none transition-colors hover:border-white hover:bg-card focus-visible:ring-2 focus-visible:ring-ring/40 sm:gap-4"
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
        {service.images?.[0] ? (
          <Image
            src={service.images[0]}
            alt={service.serviceName}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
          {getCategoryLabel(service.category)}
        </p>
        <h3 className="mt-1.5 truncate font-heading text-base leading-snug tracking-tight text-foreground sm:text-lg">
          {service.serviceName}
        </h3>
        <p className="mt-1 truncate text-[0.7rem] text-muted-foreground sm:text-xs">
          {vendorName} · {service.location}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="whitespace-nowrap font-heading text-sm text-foreground sm:text-base">
          {formatCurrency(service.price)}
        </p>
        <ArrowUpRight className="ml-auto mt-1 size-3.5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
