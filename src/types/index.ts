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

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}
