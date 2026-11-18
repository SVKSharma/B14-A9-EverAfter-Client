"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  CloudOff,
  Crown,
  Heart,
  MapPin,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { apiFetch, ApiError, getErrorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { getCategoryLabel } from "@/lib/constants";
import { useSessionUser } from "@/hooks/use-session-user";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

function Gallery({ service }: { service: Service }) {
  const images = service.images?.filter(Boolean) ?? [];
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
        {current ? (
          <Image
            src={current}
            alt={`${service.serviceName} — photo ${active + 1}`}
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center bg-linear-to-br from-secondary to-accent/60">
            <Heart className="size-14 text-primary/25" strokeWidth={1.2} />
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-xl border-2 bg-muted transition-opacity",
                index === active
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Skeleton className="aspect-4/3 w-full rounded-2xl" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export function ServiceDetails({ id }: { id: string }) {
  const { user } = useSessionUser();
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await apiFetch<Service>(`/services/${id}`, {
          auth: false,
          signal: controller.signal,
        });
        if (!controller.signal.aborted) setService(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        if (requestError instanceof ApiError && requestError.status === 404) {
          setNotFound(true);
          return;
        }
        setError(getErrorMessage(requestError));
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [id, reloadKey]);

  useEffect(() => {
    if (!service) return;
    const controller = new AbortController();

    const loadRelated = async () => {
      try {
        const data = await apiFetch<Service[]>(
          `/services?category=${service.category}&limit=4&sort=newest`,
          { auth: false, signal: controller.signal }
        );
        if (!controller.signal.aborted) {
          setRelated((data ?? []).filter((item) => item._id !== service._id).slice(0, 3));
        }
      } catch {
        if (!controller.signal.aborted) setRelated([]);
      }
    };

    void loadRelated();
    return () => controller.abort();
  }, [service]);

  if (isLoading) return <DetailsSkeleton />;

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={Heart}
          title="This service isn't available"
          description="The service may have been removed, is awaiting approval, or is no longer accepting bookings."
          action={
            <Link href="/services" className={cn(buttonVariants({ size: "lg" }), "h-10 gap-2 px-5")}>
              <ArrowLeft className="size-4" />
              Back to services
            </Link>
          }
        />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          icon={CloudOff}
          title="We couldn't load this service"
          description={error ?? "Please try again in a moment."}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="h-10 px-5"
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  setReloadKey((key) => key + 1);
                }}
              >
                Try again
              </Button>
              <Link
                href="/services"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-10 gap-2 px-5")}
              >
                <ArrowLeft className="size-4" />
                Back to services
              </Link>
            </div>
          }
        />
      </div>
    );
  }

  const vendorName = service.vendor?.businessName || service.vendor?.name || "EverAfter vendor";
  const isPremium = service.vendor?.subscriptionPlan === "premium";
  const isOwnService = user?.role === "vendor" && user.id === service.vendorId;
  const isAdmin = user?.role === "admin";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <Link
        href="/services"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to all services
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <Gallery service={service} />

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="px-2.5 py-1">
                {getCategoryLabel(service.category)}
              </Badge>
              {isPremium ? (
                <Badge className="gap-1 bg-gold px-2.5 py-1 text-plum">
                  <Crown className="size-3.5" />
                  Premium vendor
                </Badge>
              ) : null}
              <Badge variant="outline" className="gap-1 px-2.5 py-1 text-primary">
                <CheckCircle2 className="size-3.5" />
                Verified &amp; active
              </Badge>
            </div>

            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {service.serviceName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-primary/70" />
                {vendorName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary/60" />
                {service.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-4 text-primary/60" />
                Starting at {formatCurrency(service.price)}
              </span>
            </div>

            <Separator className="my-8" />

            <section aria-labelledby="about-service">
              <h2 id="about-service" className="font-heading text-2xl font-semibold tracking-tight">
                About this service
              </h2>
              <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </section>

            <section aria-labelledby="service-details" className="mt-10">
              <h2 id="service-details" className="font-heading text-2xl font-semibold tracking-tight">
                Service details
              </h2>
              <dl className="mt-4 grid gap-4 rounded-2xl border border-border/70 bg-card p-5 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Category
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">{getCategoryLabel(service.category)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <MapPin className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Location
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">{service.location}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Availability
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {service.availability ? "Accepting bookings" : "Fully booked"}
                    </dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <CalendarDays className="size-4" />
                  </span>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Listed
                    </dt>
                    <dd className="mt-0.5 text-sm font-medium">
                      {new Date(service.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </dd>
                  </div>
                </div>
              </dl>
            </section>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Starting from
            </p>
            <p className="mt-1 font-heading text-4xl font-semibold tracking-tight text-primary">
              {formatCurrency(service.price)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Final quote depends on your date, guest count, and location.
            </p>

            <div className="mt-6">
              {isOwnService ? (
                <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                  This is your own service, so you can&apos;t send a booking request to yourself.
                </div>
              ) : isAdmin ? (
                <div className="rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
                  Admin accounts can&apos;t submit customer booking requests.
                </div>
              ) : (
                <Link
                  href={`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`}
                  className={cn(buttonVariants({ size: "lg" }), "h-12 w-full gap-2 text-base shadow-sm")}
                >
                  Sign in to book
                </Link>
              )}
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {isOwnService || isAdmin
                  ? "Switch to a customer account to book services."
                  : "Booking requests are free. You only pay the vendor directly."}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="flex items-start gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                {service.vendor?.image ? (
                  <Image
                    src={service.vendor.image}
                    alt={vendorName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center font-heading text-lg font-semibold text-primary">
                    {vendorName.charAt(0)}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Your vendor
                </p>
                <p className="mt-0.5 font-medium">{vendorName}</p>
                {service.vendor?.name && service.vendor.businessName ? (
                  <p className="text-sm text-muted-foreground">{service.vendor.name}</p>
                ) : null}
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary/70" />
                Reviewed before going live
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary/70" />
                Responds through your dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary/70" />
                No booking fees for couples
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-16 border-t border-border/70 pt-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">
                More like this
              </p>
              <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
                You may also love
              </h2>
            </div>
            <Link
              href={`/services?category=${service.category}`}
              className="text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              See all
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ServiceCard key={item._id} service={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
