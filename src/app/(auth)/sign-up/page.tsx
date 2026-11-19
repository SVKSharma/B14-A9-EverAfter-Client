import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create an Account",
  description: "Join EverAfter as a couple or a wedding vendor.",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
