"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
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
import { useDocumentTitle } from "@/hooks/use-document-title";
import { BookingForm } from "@/components/bookings/booking-form";
import { ServiceCard } from "@/components/shared/service-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Gallery } from "@/components/services/gallery";
import { ServiceDetailsSkeleton } from "@/components/shared/page-skeletons";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

export function ServiceDetails({ id, signInHref }: { id: string; signInHref: string }) {
  const { user } = useSessionUser();
  const [service, setService] = useState<Service | null>(null);
  const [related, setRelated] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useDocumentTitle(service?.serviceName);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const data = await apiFetch<Service>(`/services/${id}`, {
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

  if (isLoading) return <ServiceDetailsSkeleton />;

  if (notFound) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-7 lg:px-8">
        <EmptyState
          icon={Heart}
          title="This service isn't available"
          description="The service may have been removed, is awaiting approval, or is no longer accepting bookings."
          action={
            <Link
              href="/services"
              className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 rounded-full px-6")}
            >
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
      <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-7 lg:px-8">
        <EmptyState
          icon={CloudOff}
          title="We couldn't load this service"
          description={error ?? "Please try again in a moment."}
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                className="h-11 rounded-full px-6"
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
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 gap-2 rounded-full px-6"
                )}
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

  const meta = [
    { icon: Sparkles, label: "Discipline", value: getCategoryLabel(service.category) },
    { icon: MapPin, label: "Location", value: service.location },
    {
      icon: ShieldCheck,
      label: "Availability",
      value: service.availability ? "Accepting bookings" : "Fully booked",
    },
    {
      icon: CalendarDays,
      label: "Listed",
      value: new Date(service.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    },
  ];

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="mesh pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto w-full max-w-7xl px-5 py-8 sm:px-7 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All services
          </Link>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-10 sm:px-7 lg:grid-cols-[1.6fr_1fr] lg:gap-14 lg:px-8 lg:py-14">
        <div className="min-w-0">
          <Gallery service={service} />

          <div className="mt-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-card px-3 py-1 text-[0.62rem] tracking-[0.14em] text-foreground uppercase">
                {getCategoryLabel(service.category)}
              </span>
              {isPremium ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[0.62rem] tracking-[0.14em] text-white uppercase">
                  <Crown className="size-3" strokeWidth={1.8} />
                  Premium
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 rounded-full border border-sage/50 bg-sage/10 px-3 py-1 text-[0.62rem] tracking-[0.14em] text-[#4f6b52] uppercase">
                <CheckCircle2 className="size-3" strokeWidth={2} />
                Verified
              </span>
            </div>

            <h1 className="mt-5 font-heading text-[2.1rem] leading-[1.1] tracking-[-0.015em] sm:text-[2.9rem]">
              {service.serviceName}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-primary/70" strokeWidth={1.7} />
                {vendorName}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-primary/60" strokeWidth={1.7} />
                {service.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag className="size-4 text-primary/60" strokeWidth={1.7} />
                From {formatCurrency(service.price)}
              </span>
            </div>

            <section aria-labelledby="about-service" className="mt-10 border-t border-border/70 pt-8">
              <h2
                id="about-service"
                className="eyebrow text-muted-foreground"
              >
                About this service
              </h2>
              <p className="mt-4 whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground/80">
                {service.description}
              </p>
            </section>

            <section aria-labelledby="service-details" className="mt-10 border-t border-border/70 pt-8">
              <h2 id="service-details" className="eyebrow text-muted-foreground">
                The details
              </h2>
              <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {meta.map((entry) => (
                  <div key={entry.label} className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-primary">
                      <entry.icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[0.62rem] tracking-[0.14em] text-muted-foreground uppercase">
                        {entry.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-foreground">{entry.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <div className="glass-strong rounded-2xl p-6">
            <p className="eyebrow text-muted-foreground">Starting from</p>
            <p className="mt-2 font-heading text-[2.6rem] leading-none tracking-tight text-primary">
              {formatCurrency(service.price)}
            </p>
            <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
              Final quote depends on your date, guest count, and location.
            </p>

            <div className="mt-6 border-t border-border/70 pt-6">
              {isOwnService ? (
                <div className="rounded-xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                  This is your own service, so you can&apos;t send a booking request to yourself.
                </div>
              ) : isAdmin ? (
                <div className="rounded-xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                  Admin accounts can&apos;t submit customer booking requests.
                </div>
              ) : user?.role === "customer" ? (
                <BookingForm service={service} />
              ) : user ? (
                <div className="rounded-xl border border-border bg-background/60 p-4 text-sm text-muted-foreground">
                  Booking requests are for customer accounts.{" "}
                  <Link href="/dashboard/vendor" className="font-medium text-primary hover:underline">
                    Go to your dashboard
                  </Link>
                </div>
              ) : (
                <Link
                  href={signInHref}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "h-12 w-full gap-2 rounded-full text-base"
                  )}
                >
                  Sign in to book
                </Link>
              )}
              <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                {isOwnService || isAdmin || (user && user.role !== "customer")
                  ? "Switch to a customer account to book services."
                  : "Booking requests are free. You only pay the vendor directly."}
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 border-t border-border/70 pt-6">
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-white/50">
                {service.vendor?.image ? (
                  <Image
                    src={service.vendor.image}
                    alt={vendorName}
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center font-heading text-base text-primary">
                    {vendorName.charAt(0)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
                  Your vendor
                </p>
                <p className="mt-1 truncate font-medium text-foreground">{vendorName}</p>
                {service.vendor?.name && service.vendor.businessName ? (
                  <p className="truncate text-xs text-muted-foreground">{service.vendor.name}</p>
                ) : null}
              </div>
            </div>

            <ul className="mt-5 space-y-2.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-sage" strokeWidth={2} />
                Reviewed before going live
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-sage" strokeWidth={2} />
                Responds through your dashboard
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 shrink-0 text-sage" strokeWidth={2} />
                No booking fees for couples
              </li>
            </ul>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="border-t border-border/70">
          <div className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-7 lg:px-8 lg:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-primary">More like this</p>
                <h2 className="mt-4 font-heading text-[1.8rem] leading-tight tracking-tight sm:text-[2.3rem]">
                  You may also love
                </h2>
              </div>
              <Link
                href={`/services?category=${service.category}`}
                className="group inline-flex items-center gap-1.5 text-[0.75rem] tracking-[0.14em] text-primary uppercase"
              >
                See all
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
