import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Crown, Heart, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { getCategoryLabel } from "@/lib/constants";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  const image = service.images?.[0];
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "EverAfter vendor";
  const isPremium = service.vendor?.subscriptionPlan === "premium";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/50 bg-card/80 shadow-(--shadow-soft) backdrop-blur-xl transition-shadow duration-500 hover:shadow-(--shadow-lift)",
        className
      )}
    >
      <div className="relative m-2 aspect-4/5 overflow-hidden rounded-xl bg-muted">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center bg-secondary">
            <Heart className="size-9 text-primary/25" strokeWidth={1.1} />
          </div>
        )}

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
          <span className="glass rounded-full px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.14em] text-foreground uppercase">
            {getCategoryLabel(service.category)}
          </span>
          {isPremium ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-[0.6rem] font-medium tracking-[0.12em] text-white uppercase">
              <Crown className="size-3" strokeWidth={1.8} />
              Premium
            </span>
          ) : null}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-charcoal/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <h3 className="font-heading text-[1.35rem] leading-snug tracking-tight text-foreground">
          <Link href={`/services/${service._id}`} className="outline-none focus-visible:underline">
            <span className="absolute inset-0" aria-hidden="true" />
            {service.serviceName}
          </Link>
        </h3>

        <p className="mt-1.5 text-[0.8rem] tracking-[0.02em] text-muted-foreground">{vendorName}</p>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground/90">
          <MapPin className="size-3.5 shrink-0 text-sage" strokeWidth={1.6} />
          {service.location}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <div>
            <p className="text-[0.6rem] tracking-[0.16em] text-muted-foreground uppercase">
              From
            </p>
            <p className="mt-1 font-heading text-xl leading-none tracking-tight text-foreground">
              {formatCurrency(service.price)}
            </p>
          </div>
          <span className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background/70 text-primary transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </article>
  );
}
