"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { toDateInputValue } from "@/lib/format";
import { bookingSchema, type BookingFormValues } from "@/lib/schemas/booking";
import type { Booking, Service } from "@/types";

interface BookingFormProps {
  service: Service;
}

export function BookingForm({ service }: BookingFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [created, setCreated] = useState<Booking | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      eventDate: "",
      eventLocation: service.location,
      message: "",
    },
    mode: "onTouched",
  });

  const message = useWatch({ control: form.control, name: "message" }) ?? "";

  const onSubmit = async (values: BookingFormValues) => {
    setIsSubmitting(true);

    try {
      const booking = await apiFetch<Booking>("/bookings", {
        method: "POST",
        body: {
          serviceId: service._id,
          eventDate: values.eventDate,
          eventLocation: values.eventLocation,
          message: values.message,
        },
      });

      setCreated(booking);
      toast.success("Request sent. The vendor will reply from their dashboard.");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (created) {
    return (
      <div className="rounded-xl border border-sage/40 bg-sage/[0.08] p-4">
        <p className="font-heading text-lg tracking-tight text-[#4f6b52]">Request sent</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {service.serviceName} will reply to your request for{" "}
          {new Date(created.eventDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
          .
        </p>
        <div className="mt-4 flex flex-col gap-2">
          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-1.5 text-[0.7rem] tracking-[0.12em] text-primary uppercase hover:underline"
          >
            View my bookings
            <ArrowRight className="size-3" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setCreated(null);
              form.reset({ eventDate: "", eventLocation: service.location, message: "" });
            }}
            className="self-start text-[0.7rem] text-muted-foreground underline-offset-4 hover:underline"
          >
            Send another request
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <p className="eyebrow text-muted-foreground">Request this service</p>

      <div className="space-y-1.5">
        <Label htmlFor="eventDate">Event date</Label>
        <Input
          id="eventDate"
          type="date"
          className="h-11 rounded-xl"
          min={toDateInputValue(new Date())}
          aria-invalid={Boolean(form.formState.errors.eventDate)}
          {...form.register("eventDate")}
        />
        {form.formState.errors.eventDate ? (
          <p className="text-xs text-destructive">{form.formState.errors.eventDate.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="eventLocation">Event location</Label>
        <Input
          id="eventLocation"
          placeholder="Venue or city"
          className="h-11 rounded-xl"
          aria-invalid={Boolean(form.formState.errors.eventLocation)}
          {...form.register("eventLocation")}
        />
        {form.formState.errors.eventLocation ? (
          <p className="text-xs text-destructive">{form.formState.errors.eventLocation.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Guest count, timings, and anything the vendor should know."
          className="rounded-xl"
          aria-invalid={Boolean(form.formState.errors.message)}
          {...form.register("message")}
        />
        {form.formState.errors.message ? (
          <p className="text-xs text-destructive">{form.formState.errors.message.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{message.length} / 1000 characters</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-12 w-full gap-2 rounded-full text-sm"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Send booking request
      </Button>
    </form>
  );
}
