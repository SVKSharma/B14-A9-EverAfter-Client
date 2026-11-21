import { z } from "zod";

/** Matches today's date in the user's timezone so past days are rejected. */
function todayIso() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60 * 1000).toISOString().slice(0, 10);
}

export const bookingSchema = z.object({
  eventDate: z
    .string()
    .min(1, "Choose your event date.")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Enter a valid date.")
    .refine((value) => value >= todayIso(), "Choose today or a future date."),
  eventLocation: z
    .string()
    .trim()
    .min(2, "Tell the vendor where the event takes place.")
    .max(160, "Location is too long."),
  message: z
    .string()
    .trim()
    .min(10, "Add a short note so the vendor can help — at least 10 characters.")
    .max(1000, "Message is too long."),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;

export const BOOKING_STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
  cancelled: "Cancelled",
} as const;
