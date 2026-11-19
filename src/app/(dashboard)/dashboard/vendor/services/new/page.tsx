import type { Metadata } from "next";
import { ServiceForm } from "@/components/dashboard/service-form";

export const metadata: Metadata = { title: "Add Service" };

export default function NewServicePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Add a service</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          New listings start as pending and go live once an admin approves them.
        </p>
      </div>
      <ServiceForm />
    </div>
  );
}
