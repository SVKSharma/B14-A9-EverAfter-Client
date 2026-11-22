import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { APP_TAGLINE } from "@/lib/constants";

const EXPLORE_LINKS = [
  { href: "/services", label: "Browse services" },
  { href: "/services?category=venues", label: "Wedding venues" },
  { href: "/services?category=photography", label: "Photography" },
  { href: "/services?category=decoration", label: "Decoration & florals" },
];

const COMPANY_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#why-everafter", label: "Why EverAfter" },
  { href: "/#stories", label: "Couple stories" },
];

const PARTNER_LINKS = [
  { href: "/sign-up?role=vendor", label: "Become a vendor" },
  { href: "/sign-up?role=customer", label: "Create an account" },
  { href: "/sign-in", label: "Sign in" },
];

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[0.65rem] tracking-[0.14em] text-white/60 uppercase transition-colors hover:border-white/35 hover:text-white"
    >
      {label}
      <ArrowUpRight className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="eyebrow text-white/45">{title}</h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <Link
              href={link.href}
              className="text-sm text-white/75 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 size-96 rounded-full bg-gold/15 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-48 right-0 size-96 rounded-full bg-primary/40 blur-[140px]" />

      <div className="relative mx-auto w-full max-w-7xl px-5 py-16 sm:px-7 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/60">{APP_TAGLINE}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Trusted vendors, transparent pricing, and one calm place to plan the day you have
              always imagined.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <SocialLink href="https://instagram.com" label="Instagram" />
              <SocialLink href="https://pinterest.com" label="Pinterest" />
              <SocialLink href="https://youtube.com" label="YouTube" />
            </div>
          </div>

          <Column title="Explore" links={EXPLORE_LINKS} />
          <Column title="EverAfter" links={COMPANY_LINKS} />
          <Column title="Couples & vendors" links={PARTNER_LINKS} />
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} EverAfter. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/45">
            <a href="mailto:hello@everafter.app" className="transition-colors hover:text-white">
              hello@everafter.app
            </a>
            <a href="tel:+15550142026" className="transition-colors hover:text-white">
              +1 (555) 014-2026
            </a>
            <span>New York · London · Lisbon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
