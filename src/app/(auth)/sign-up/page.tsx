import type { Metadata } from "next";
import { AuthPending } from "@/components/auth/auth-pending";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join EverAfter as a couple or a wedding vendor.",
};

export default function SignUpPage() {
  return (
    <AuthPending
      eyebrow="Join EverAfter"
      title="Create your account"
      description="Whether you're planning a wedding or growing a wedding business, your account is the first step."
    />
  );
}
