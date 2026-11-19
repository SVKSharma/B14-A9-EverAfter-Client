import type { Metadata } from "next";
import Link from "next/link";
import { VendorBookingList } from "@/components/bookings/vendor-booking-list";
import { serverApiFetch } from "@/lib/server-api";
import type { Booking } from "@/types";

export const metadata: Metadata = { title: "Booking Requests" };

export default async function VendorBookingsPage() {
  const bookings = (await serverApiFetch<Booking[]>("/bookings/vendor")) ?? [];

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link href="/dashboard/vendor" className="hover:text-foreground">
          Vendor dashboard
        </Link>
        <span className="mx-1.5">/</span>
        <span className="text-foreground">Booking requests</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Booking requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Accept or decline requests from couples. Accepted bookings are confirmed instantly.
        </p>
      </div>

      <VendorBookingList initialBookings={bookings} />
    </div>
  );
}
