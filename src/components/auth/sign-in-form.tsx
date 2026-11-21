"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/auth/google-icon";
import { authClient, resetTokenCache } from "@/lib/auth-client";
import { DASHBOARD_PATH_BY_ROLE } from "@/lib/constants";
import { safeRedirectPath } from "@/lib/redirect";
import { normalizeRole } from "@/lib/roles";
import { signInSchema, type SignInValues } from "@/lib/schemas/auth";

function SignInFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));
  const isBlocked = searchParams.get("blocked") === "1";

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SignInValues) => {
    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      toast.error(error.message ?? "Could not sign you in. Check your details and try again.");
      return;
    }

    resetTokenCache();
    const role = normalizeRole(data?.user?.role);
    toast.success("Welcome back");
    router.push(redirectTo ?? DASHBOARD_PATH_BY_ROLE[role]);
    router.refresh();
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo ?? "/dashboard",
    });
    if (error) {
      setIsGoogleLoading(false);
      toast.error(error.message ?? "Google sign-in could not start. Try again.");
    }
  };

  return (
    <div>
      <p className="eyebrow text-primary">Welcome back</p>
      <h1 className="mt-3 font-heading text-[2.1rem] leading-[1.1] tracking-tight sm:text-[2.5rem]">
        Sign in to <em className="italic text-primary">EverAfter</em>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Your bookings, enquiries and subscription — all in one calm place.
      </p>

      {isBlocked ? (
        <Alert variant="destructive" className="mt-6">
          <LockKeyhole className="size-4" />
          <AlertTitle>Account blocked</AlertTitle>
          <AlertDescription>
            This account has been blocked. Contact support if you think this is a mistake.
          </AlertDescription>
        </Alert>
      ) : null}

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="mt-7 h-12 w-full gap-2.5 rounded-full"
        onClick={handleGoogle}
        disabled={isGoogleLoading || isSubmitting}
      >
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
          or with email
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-12 rounded-xl"
            aria-invalid={Boolean(form.formState.errors.email)}
            {...form.register("email")}
          />
          {form.formState.errors.email ? (
            <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="password">Password</Label>
            <span className="text-[0.7rem] text-muted-foreground">Min 6 chars</span>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="h-12 rounded-xl pr-12"
              aria-invalid={Boolean(form.formState.errors.password)}
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {form.formState.errors.password ? (
            <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        New to EverAfter?{" "}
        <Link
          href={redirectTo ? `/sign-up?redirect=${encodeURIComponent(redirectTo)}` : "/sign-up"}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function SignInForm() {
  return (
    <Suspense fallback={<div className="skeleton h-96 rounded-2xl" />}>
      <SignInFormInner />
    </Suspense>
  );
}
