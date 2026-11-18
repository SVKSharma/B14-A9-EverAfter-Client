import type { ReactNode } from "react";
import Image from "next/image";
import { Logo } from "@/components/layout/logo";
import { APP_TAGLINE } from "@/lib/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-plum lg:block">
        <Image
          src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80"
          alt="A couple holding hands with wedding rings and a bouquet"
          fill
          priority
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-plum/95 via-plum/35 to-plum/20" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo tone="light" />
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
              EverAfter
            </p>
            <p className="mt-4 font-heading text-4xl font-medium leading-tight text-white">
              {APP_TAGLINE}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Trusted vendors, transparent pricing, and one calm place to plan the day you&apos;ve
              always imagined.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex flex-col px-6 py-10 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          © EverAfter. All rights reserved.
        </p>
      </div>
    </div>
  );
}
