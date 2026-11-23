"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "@/components/shared/image-upload";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { CATEGORIES } from "@/lib/constants";
import { serviceSchema, type ServiceFormValues } from "@/lib/schemas/service";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

interface ServiceFormProps {
  service?: Service;
}

function Section({
  index,
  title,
  description,
  children,
}: {
  index: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border/70 pt-7 first:border-t-0 first:pt-0">
      <div className="flex gap-4">
        <span className="hidden font-heading text-sm text-muted-foreground/60 tabular-nums sm:block">
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-xl leading-tight tracking-tight">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
          <div className="mt-5 space-y-4">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(service);

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      serviceName: service?.serviceName ?? "",
      description: service?.description ?? "",
      category: (service?.category as ServiceFormValues["category"]) ?? "photography",
      price: service?.price ?? 0,
      location: service?.location ?? "",
      images: service?.images ?? [],
      availability: service?.availability ?? true,
    },
    mode: "onTouched",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const images = useWatch({ control: form.control, name: "images" }) ?? [];
  const description = useWatch({ control: form.control, name: "description" }) ?? "";
  const category = useWatch({ control: form.control, name: "category" });
  const availability = useWatch({ control: form.control, name: "availability" });

  const onSubmit = async (values: ServiceFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await apiFetch(`/vendor/services/${service!._id}`, { method: "PATCH", body: values });
        toast.success("Service updated. It will be reviewed again before going live.");
      } else {
        await apiFetch("/vendor/services", { method: "POST", body: values });
        toast.success("Service submitted. An admin will review it shortly.");
      }

      router.push("/dashboard/vendor/services");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <Section
        index="01"
        title="The basics"
        description="How the listing appears in the catalogue."
      >
        <div className="space-y-2">
          <Label htmlFor="serviceName">Service name</Label>
          <Input
            id="serviceName"
            placeholder="Golden hour portrait session"
            className="h-11 rounded-xl"
            aria-invalid={Boolean(form.formState.errors.serviceName)}
            {...form.register("serviceName")}
          />
          {form.formState.errors.serviceName ? (
            <p className="text-xs text-destructive">{form.formState.errors.serviceName.message}</p>
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={category}
              onValueChange={(value) =>
                form.setValue("category", value as ServiceFormValues["category"], {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger id="category" className="h-11 w-full rounded-xl">
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.category ? (
              <p className="text-xs text-destructive">{form.formState.errors.category.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Starting price (USD)</Label>
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              min={0}
              className="h-11 rounded-xl"
              aria-invalid={Boolean(form.formState.errors.price)}
              {...form.register("price", { valueAsNumber: true })}
            />
            {form.formState.errors.price ? (
              <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Service area</Label>
          <Input
            id="location"
            placeholder="Dhaka and surrounding areas"
            className="h-11 rounded-xl"
            aria-invalid={Boolean(form.formState.errors.location)}
            {...form.register("location")}
          />
          {form.formState.errors.location ? (
            <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>
          ) : null}
        </div>
      </Section>

      <Section
        index="02"
        title="Description"
        description="What is included, how you work, and what couples should expect."
      >
        <div className="space-y-2">
          <Textarea
            id="description"
            rows={7}
            placeholder="Tell couples about your approach, what the package includes, and how you work on the day."
            className="rounded-xl"
            aria-invalid={Boolean(form.formState.errors.description)}
            {...form.register("description")}
          />
          {form.formState.errors.description ? (
            <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">{description.length} / 2000 characters</p>
          )}
        </div>
      </Section>

      <Section
        index="03"
        title="Photographs"
        description="Up to four images. The first one is used as the cover."
      >
        <ImageUpload
          value={images}
          onChange={(next) => form.setValue("images", next, { shouldValidate: true })}
          label={form.getValues("serviceName") || "Service"}
        />
        {form.formState.errors.images ? (
          <p className="text-xs text-destructive">{form.formState.errors.images.message}</p>
        ) : null}
      </Section>

      <Section
        index="04"
        title="Availability"
        description="Control whether couples can send new requests."
      >
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition-colors",
            availability
              ? "border-sage/45 bg-sage/[0.07]"
              : "border-border bg-card/60"
          )}
        >
          <input
            type="checkbox"
            className="mt-0.5 size-4 accent-primary"
            checked={availability}
            onChange={(event) =>
              form.setValue("availability", event.target.checked, { shouldDirty: true })
            }
          />
          <span>
            <span className="block text-sm font-medium">Available for bookings</span>
            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
              Unavailable services stay listed but are hidden from the public catalogue.
            </span>
          </span>
        </label>
      </Section>

      <div className="flex flex-col gap-2 border-t border-border/70 pt-6 sm:flex-row">
        <Button
          type="submit"
          size="lg"
          className="h-12 rounded-full px-7 sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEditing ? "Save changes" : "Submit for review"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 rounded-full px-7"
          onClick={() => router.push("/dashboard/vendor/services")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
