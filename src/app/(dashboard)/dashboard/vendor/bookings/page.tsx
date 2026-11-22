import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { VendorBookingList } from "@/components/bookings/vendor-booking-list";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

export const metadata: Metadata = { title: "Booking Requests" };

export default async function VendorBookingsPage() {
  const bookings = (await serverApiFetch<Booking[]>("/bookings/vendor")) ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Vendor dashboard", href: "/dashboard/vendor" },
          { label: "Booking requests" },
        ]}
        eyebrow="Requests"
        title="Booking requests"
        description="Accept or decline requests from couples. Accepted bookings are confirmed instantly."
        actions={
          <Link
            href="/dashboard/vendor/services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-full px-5"
            )}
          >
            <Store className="size-4" />
            My services
          </Link>
        }
      />

      <VendorBookingList initialBookings={bookings} />
    </div>
  );
}
