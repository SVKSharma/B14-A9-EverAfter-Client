"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { ServiceForm } from "@/components/dashboard/service-form";
import { ServiceFormSkeleton } from "@/components/shared/page-skeletons";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { apiFetch, getErrorMessage } from "@/lib/api";
import type { Service } from "@/types";

export function EditServiceLoader() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(service?.serviceName ? `Edit ${service.serviceName}` : null);

  useEffect(() => {
    let active = true;

    apiFetch<Service>(`/vendor/services/${params.id}`)
      .then((data) => {
        if (active) setService(data);
      })
      .catch((cause) => {
        if (!active) return;
        const message = getErrorMessage(cause);
        setError(message);
        toast.error(message);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-border/70 bg-card/60 p-10 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Link
          href="/dashboard/vendor/services"
          className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase hover:underline"
        >
          <ArrowLeft className="size-3.5" />
          Back to my services
        </Link>
      </div>
    );
  }

  if (!service) {
    return <ServiceFormSkeleton />;
  }

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
        <p className="mt-5 eyebrow text-primary">Edit listing</p>
        <h1 className="mt-3 truncate font-heading text-[1.9rem] leading-tight tracking-tight">
          {service.serviceName}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {service.status === "approved"
            ? "Approved services return to review after you save changes."
            : "Changes are saved immediately and stay in their current review state."}
        </p>
      </header>

      <div className="mt-8">
        <ServiceForm service={service} />
      </div>
    </div>
  );
}
