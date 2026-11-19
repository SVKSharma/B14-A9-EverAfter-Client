import type { Metadata } from "next";
import { BookingDetails } from "@/components/bookings/booking-details";

export const metadata: Metadata = { title: "Booking Details" };

export default async function CustomerBookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <BookingDetails id={id} />;
}
