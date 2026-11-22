import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <Image
          src="/images/auth.jpg"
          alt="A couple holding hands with wedding rings and a bouquet"
          fill
          priority
          sizes="52vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/40 to-charcoal/20" />
        <div className="pointer-events-none absolute -left-24 top-1/3 size-96 rounded-full bg-gold/20 blur-[120px]" />

        <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
          <Logo tone="light" />

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-charcoal/45 px-3.5 py-1.5 backdrop-blur-md">
              <span className="flex items-center gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="size-2.5 fill-current" strokeWidth={0} />
                ))}
              </span>
              <span className="text-[0.6rem] tracking-[0.16em] text-white uppercase">
                4.9 from 2,400 couples
              </span>
            </span>

            <blockquote className="mt-7 font-heading text-[2rem] leading-[1.25] tracking-tight text-white xl:text-[2.4rem]">
              &ldquo;We found every vendor for our day in one place, and planned it all in a
              single afternoon.&rdquo;
            </blockquote>
            <p className="mt-5 text-[0.65rem] tracking-[0.18em] text-white/55 uppercase">
              Amara &amp; Jonah · Hudson Valley
            </p>
          </div>

          <p className="text-xs text-white/40">
            New York · London · Lisbon — curated wedding vendors since 2021.
          </p>
        </div>
      </aside>

      <div className="flex flex-col px-5 py-8 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between gap-4 lg:hidden">
          <Logo />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase"
          >
            <ArrowLeft className="size-3" />
            Home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <p className="text-center text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} EverAfter
        </p>
      </div>
    </div>
  );
}
