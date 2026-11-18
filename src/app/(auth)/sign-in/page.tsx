import type { Metadata } from "next";
import { AuthPending } from "@/components/auth/auth-pending";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your EverAfter account to manage bookings and services.",
};

export default function SignInPage() {
  return (
    <AuthPending
      eyebrow="Welcome back"
      title="Sign in to EverAfter"
      description="Pick up where you left off — manage your bookings, services, and subscription."
    />
  );
}
