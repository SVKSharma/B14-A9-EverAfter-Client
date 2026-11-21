import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/dashboard/service-form";

export const metadata: Metadata = { title: "Add Service" };

export default function NewServicePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="border-b border-border/70 pb-6">
        <Link
          href="/dashboard/vendor/services"
          className="inline-flex items-center gap-1.5 text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          My services
        </Link>
        <p className="mt-5 eyebrow text-primary">New listing</p>
        <h1 className="mt-3 font-heading text-[1.9rem] leading-tight tracking-tight">
          Add a service
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          New listings start as pending and go live once an admin approves them.
        </p>
      </header>

      <div className="mt-8">
        <ServiceForm />
      </div>
    </div>
  );
}
