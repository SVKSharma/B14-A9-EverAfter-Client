"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ServiceForm } from "@/components/dashboard/service-form";
import { apiFetch, getErrorMessage } from "@/lib/api";
import type { Service } from "@/types";

export function EditServiceLoader() {
  const params = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">{error}</p>
        <Link href="/dashboard/vendor/services" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          Back to my services
        </Link>
      </div>
    );
  }

  if (!service) {
    return <div className="h-96 animate-pulse rounded-2xl bg-secondary/40" />;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Edit service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {service.status === "approved"
            ? "Approved services return to review after you save changes."
            : "Changes are saved immediately and stay in their current review state."}
        </p>
      </div>
      <ServiceForm service={service} />
    </div>
  );
}
