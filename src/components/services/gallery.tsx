"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

export function Gallery({ service }: { service: Service }) {
  const images = service.images?.filter(Boolean) ?? [];
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-white/50">
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
          <div className="grid h-full place-items-center bg-secondary">
            <Heart className="size-14 text-primary/25" strokeWidth={1.2} />
          </div>
        )}

        {images.length > 1 ? (
          <span className="glass absolute bottom-4 right-4 rounded-full px-3 py-1.5 text-[0.65rem] tracking-[0.14em] text-foreground uppercase">
            {active + 1} / {images.length}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-3 grid grid-cols-4 gap-2.5 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-pressed={index === active}
              className={cn(
                "relative aspect-4/3 overflow-hidden rounded-xl bg-muted outline-none transition-all",
                index === active
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                  : "opacity-65 hover:opacity-100"
              )}
            >
              <Image src={image} alt="" fill sizes="20vw" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
