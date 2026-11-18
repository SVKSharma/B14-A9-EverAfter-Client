import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { APP_TAGLINE } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M15 3h-2.4A3.6 3.6 0 0 0 9 6.6V9H6v3.2h3V21h3.2v-8.8h2.9l.6-3.2h-3.5V6.9c0-.5.4-.9.9-.9H15V3Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10 9.5 5 2.5-5 2.5v-5Z" />
    </svg>
  );
}

const EXPLORE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Browse Services" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#why-everafter", label: "Why EverAfter" },
];

const PARTNER_LINKS = [
  { href: "/sign-up?role=vendor", label: "Join as a vendor" },
  { href: "/sign-up?role=customer", label: "Create an account" },
  { href: "/sign-in", label: "Vendor sign in" },
];

const SOCIALS = [
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", Icon: FacebookIcon },
  { href: "https://youtube.com", label: "YouTube", Icon: YoutubeIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-secondary/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {APP_TAGLINE} Discover trusted wedding vendors, compare services, and book your
              dream team in one calm, beautiful place.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">Explore</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">For couples & vendors</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              {PARTNER_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
                <span>12 Rose Lane, Suite 4, New York, NY 10012</span>
              </li>
              <li>
                <a
                  href="mailto:hello@everafter.app"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Mail className="size-4 shrink-0 text-primary/70" />
                  hello@everafter.app
                </a>
              </li>
              <li>
                <a
                  href="tel:+15550142026"
                  className="flex items-center gap-2.5 transition-colors hover:text-primary"
                >
                  <Phone className="size-4 shrink-0 text-primary/70" />
                  +1 (555) 014-2026
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© EverAfter. All rights reserved.</p>
          <p className="text-muted-foreground/80">Made for couples, by romantics.</p>
        </div>
      </div>
    </footer>
  );
}
