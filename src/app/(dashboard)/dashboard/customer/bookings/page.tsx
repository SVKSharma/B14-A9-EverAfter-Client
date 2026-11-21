import type { Metadata } from "next";
import Link from "next/link";
import { BookingList } from "@/components/bookings/booking-list";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types";

export const metadata: Metadata = { title: "My Bookings" };

export default async function CustomerBookingsPage() {
  const bookings = (await serverApiFetch<Booking[]>("/bookings/mine")) ?? [];

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/customer" className="hover:text-foreground">
          Customer dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Bookings</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">My bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Track every request you have sent and cancel ones that are still pending.
        </p>
      </div>

      <BookingList initialBookings={bookings} />
    </div>
  );
}
