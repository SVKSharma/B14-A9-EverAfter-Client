import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Heart, MapPin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { getCategoryLabel } from "@/lib/constants";
import type { Service } from "@/types";
import { cn } from "@/lib/utils";

export function ServiceCard({ service }: { service: Service }) {
  const image = service.images?.[0];
  const vendorName =
    service.vendor?.businessName || service.vendor?.name || "EverAfter vendor";
  const isPremium = service.vendor?.subscriptionPlan === "premium";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
      <div className="relative aspect-4/3 overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={service.serviceName}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-linear-to-br from-secondary to-accent/60">
            <Heart className="size-10 text-primary/30" strokeWidth={1.2} />
          </div>
        )}

        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground shadow-sm backdrop-blur-sm">
          {getCategoryLabel(service.category)}
        </Badge>

        {isPremium ? (
          <Badge className="absolute right-3 top-3 bg-gold text-plum shadow-sm">
            Premium
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-heading text-xl font-semibold leading-snug tracking-tight">
            {service.serviceName}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <BadgeCheck className="size-4 text-primary/70" />
            {vendorName}
          </p>
        </div>

        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary/60" />
          {service.location}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border/70 pt-4">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Starting from
            </p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(service.price)}
            </p>
          </div>
          <Link
            href={`/services/${service._id}`}
            className={cn(buttonVariants({ size: "lg" }), "h-9 px-4")}
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
