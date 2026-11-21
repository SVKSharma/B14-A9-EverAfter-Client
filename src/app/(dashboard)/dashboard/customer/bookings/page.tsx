import type { Metadata } from "next";
import Link from "next/link";
import { Compass } from "lucide-react";
import { BookingList } from "@/components/bookings/booking-list";
import { PageHeader } from "@/components/shared/page-header";
import { buttonVariants } from "@/components/ui/button";
import { serverApiFetch } from "@/lib/server-api";
import { cn } from "@/lib/utils";
import type { Booking } from "@/types";

export const metadata: Metadata = { title: "My Bookings" };

export default async function CustomerBookingsPage() {
  const bookings = (await serverApiFetch<Booking[]>("/bookings/mine")) ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        breadcrumb={[
          { label: "Customer dashboard", href: "/dashboard/customer" },
          { label: "Bookings" },
        ]}
        eyebrow="Your planning"
        title="My bookings"
        description="Track every request you have sent and cancel ones that are still pending."
        actions={
          <Link
            href="/services"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 gap-2 rounded-full px-5"
            )}
          >
            <Compass className="size-4" />
            Find services
          </Link>
        }
      />

      <BookingList initialBookings={bookings} />
    </div>
  );
}
