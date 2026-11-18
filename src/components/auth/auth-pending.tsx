import Link from "next/link";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthPendingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AuthPending({ eyebrow, title, description }: AuthPendingProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{eyebrow}</p>
      <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="mt-8 rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <div className="flex gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/60 text-plum">
            <Info className="size-4" />
          </span>
          <div>
            <p className="font-medium">Accounts are almost ready</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              We&apos;re putting the finishing touches on sign-in and registration. You can browse
              services in the meantime — booking and dashboards open as soon as accounts go live.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/services"
            className={cn(buttonVariants({ size: "lg" }), "h-10 gap-2 px-5")}
          >
            Browse services
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "h-10 gap-2 px-4")}
          >
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
