export type Role = "admin" | "vendor" | "customer";
export type SubscriptionPlan = "free" | "premium";
export type ServiceStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";
export type TransactionStatus = "pending" | "success" | "failed" | "expired";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt: string | null;
  createdAt?: string;
}

/** Normalized shape the UI consumes from the Better Auth session. */
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  isBlocked: boolean;
  businessName?: string | null;
  subscriptionPlan?: SubscriptionPlan;
}

export interface PublicVendor {
  id: string;
  name: string;
  businessName: string | null;
  image: string | null;
  subscriptionPlan: SubscriptionPlan;
  /** Only present on admin listings. */
  email?: string | null;
}

export interface Service {
  _id: string;
  vendorId: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  rejectionReason?: string | null;
  availability: boolean;
  createdAt: string;
  updatedAt?: string;
  vendor?: PublicVendor | null;
}

export interface Booking {
  _id: string;
  serviceId: string;
  vendorId: string;
  customerId: string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  service?: Pick<Service, "_id" | "serviceName" | "images" | "price" | "location"> | null;
  vendor?: PublicVendor | null;
  customer?: { id: string; name: string; email: string; image: string | null } | null;
}

export interface Transaction {
  _id: string;
  vendorId: string;
  plan: SubscriptionPlan;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId: string | null;
  status: TransactionStatus;
  createdAt: string;
  vendor?: PublicVendor | null;
}

/** Shape returned by GET /api/users/me. */
export interface ProfileUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  businessName: string | null;
  isBlocked: boolean;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt: string | null;
  createdAt?: string | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface VendorStats {
  services: { total: number; active: number; pending: number };
  bookings: { pending: number; accepted: number; rejected: number };
  plan: SubscriptionPlan;
  quota: {
    plan: SubscriptionPlan;
    limit: number | null;
    used: number;
    remaining: number | null;
  };
}

export interface CustomerStats {
  bookings: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    cancelled: number;
  };
}

export interface AdminStats {
  users: { total: number; customers: number; vendors: number; blocked: number };
  services: { total: number; pending: number; approved: number; rejected: number };
  bookings: { total: number; pending: number };
  subscriptions: { premiumVendors: number; transactions: number; successful: number };
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: Role;
  isBlocked: boolean;
  businessName: string | null;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt: string | null;
  createdAt?: string;
  counts: {
    services: number;
    approvedServices: number;
    pendingServices: number;
    bookings: number;
    pendingBookings: number;
  };
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}
