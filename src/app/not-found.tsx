import Link from "next/link";
import { ArrowLeft, Heart, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-linear-to-b from-secondary/60 to-background px-6 text-center">
      <span className="grid size-16 place-items-center rounded-full border border-primary/15 bg-primary/5">
        <SearchX className="size-7 text-primary" strokeWidth={1.5} />
      </span>
      <p className="mt-6 font-heading text-6xl font-semibold tracking-tight text-primary">404</p>
      <h1 className="mt-2 font-heading text-3xl font-semibold">This page took a different aisle</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Let&apos;s get
        you back to something beautiful.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        <Link href="/" className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-6")}>
          <ArrowLeft className="size-4" />
          Back home
        </Link>
        <Link
          href="/services"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-11 gap-2 px-6")}
        >
          <Heart className="size-4" />
          Browse services
        </Link>
      </div>
    </div>
  );
}
