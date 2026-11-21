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
import type { Service } from "@/types";

interface ServiceFormProps {
  service?: Service;
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="serviceName">Service name</Label>
        <Input
          id="serviceName"
          placeholder="Golden hour portrait session"
          className="h-11"
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
            <SelectTrigger id="category" className="h-11 w-full">
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
          <Label htmlFor="price">Starting price (BDT)</Label>
          <Input
            id="price"
            type="number"
            inputMode="numeric"
            min={0}
            className="h-11"
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
          className="h-11"
          aria-invalid={Boolean(form.formState.errors.location)}
          {...form.register("location")}
        />
        {form.formState.errors.location ? (
          <p className="text-xs text-destructive">{form.formState.errors.location.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={6}
          placeholder="What is included, how you work, and what makes your service special."
          aria-invalid={Boolean(form.formState.errors.description)}
          {...form.register("description")}
        />
        {form.formState.errors.description ? (
          <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            {description.length} / 2000 characters
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Photos</Label>
        <ImageUpload
          value={images}
          onChange={(next) => form.setValue("images", next, { shouldValidate: true })}
          label={form.getValues("serviceName") || "Service"}
        />
        {form.formState.errors.images ? (
          <p className="text-xs text-destructive">{form.formState.errors.images.message}</p>
        ) : null}
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-border/80 bg-secondary/20 px-4 py-3">
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
          <span className="block text-xs text-muted-foreground">
            Unavailable services are hidden from the public catalogue.
          </span>
        </span>
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button type="submit" size="lg" className="h-11 sm:w-48" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isEditing ? "Save changes" : "Submit for review"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-11 sm:w-32"
          onClick={() => router.push("/dashboard/vendor/services")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
