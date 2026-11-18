import type { BookingStatus, Role, ServiceStatus } from "@/types";

export const APP_NAME = "EverAfter";
export const APP_TAGLINE = "Your day. Your dream. Your Ever After.";

export const CATEGORIES = [
  {
    value: "photography",
    label: "Photography & Videography",
    shortLabel: "Photography",
    blurb: "Capture every glance, laugh, and happy tear.",
  },
  {
    value: "venues",
    label: "Wedding Venues",
    shortLabel: "Venues",
    blurb: "Gardens, ballrooms, and seaside settings.",
  },
  {
    value: "decoration",
    label: "Decoration & Florist",
    shortLabel: "Decoration",
    blurb: "Florals and styling that set the scene.",
  },
  {
    value: "catering",
    label: "Catering Services",
    shortLabel: "Catering",
    blurb: "Menus your guests will talk about for years.",
  },
  {
    value: "makeup",
    label: "Makeup & Styling",
    shortLabel: "Makeup & Styling",
    blurb: "Looks that feel effortlessly you.",
  },
  {
    value: "fashion",
    label: "Wedding Fashion",
    shortLabel: "Fashion",
    blurb: "Dresses, suits, and everything in between.",
  },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];

export const CATEGORY_VALUES = CATEGORIES.map((category) => category.value);

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((category) => category.value === value)?.label ?? value;
}

export const SERVICE_STATUSES: ServiceStatus[] = ["pending", "approved", "rejected"];
export const BOOKING_STATUSES: BookingStatus[] = ["pending", "accepted", "rejected", "cancelled"];

export const FREE_SERVICE_LIMIT = 3;
export const MAX_SERVICE_IMAGES = 4;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ROLES: Role[] = ["admin", "vendor", "customer"];

export const DASHBOARD_PATH_BY_ROLE: Record<Role, string> = {
  admin: "/dashboard/admin",
  vendor: "/dashboard/vendor",
  customer: "/dashboard/customer",
};

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  vendor: "Vendor",
  customer: "Customer",
};

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
] as const;

export const PREMIUM_BENEFITS = [
  "Unlimited active services",
  "Premium vendor badge on your listings",
  "Priority placement in featured services",
  "Everything included in the Free plan",
] as const;

export const FREE_BENEFITS = [
  `Up to ${FREE_SERVICE_LIMIT} active services`,
  "Basic vendor dashboard",
  "Booking request management",
] as const;
