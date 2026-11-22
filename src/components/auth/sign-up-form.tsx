"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "@/components/auth/google-icon";
import { SignUpAvatar } from "@/components/auth/sign-up-avatar";
import { AuthFormSkeleton } from "@/components/shared/page-skeletons";
import { apiFetch } from "@/lib/api";
import { authClient, resetTokenCache } from "@/lib/auth-client";
import { DASHBOARD_PATH_BY_ROLE } from "@/lib/constants";
import { safeRedirectPath } from "@/lib/redirect";
import { normalizeRole } from "@/lib/roles";
import { signUpSchema, type SignUpValues } from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const ROLE_OPTIONS: {
  value: Extract<Role, "vendor" | "customer">;
  label: string;
  blurb: string;
}[] = [
  { value: "customer", label: "A couple", blurb: "I'm planning a wedding" },
  { value: "vendor", label: "A vendor", blurb: "I offer wedding services" },
];

function SignUpFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = safeRedirectPath(searchParams.get("redirect"));

  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", role: undefined, image: "" },
    mode: "onTouched",
  });

  const role = useWatch({ control: form.control, name: "role" });
  const image = useWatch({ control: form.control, name: "image" }) ?? "";
  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (values: SignUpValues) => {
    const { data, error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });

    if (error) {
      toast.error(error.message ?? "Could not create your account. Try again.");
      return;
    }

    resetTokenCache();

    if (values.image) {
      try {
        const uploaded = await apiFetch<{ url: string }>("/uploads/image", {
          method: "POST",
          body: { image: values.image, name: `${values.name}-avatar` },
        });
        await apiFetch("/users/me", { method: "PATCH", body: { image: uploaded.url } });
      } catch {
        toast.warning("Account created, but your photo could not be saved. Add it from your profile.");
      }
    }

    const resolvedRole = normalizeRole(data?.user?.role);
    toast.success("Account created. Welcome to EverAfter!");
    router.push(redirectTo ?? DASHBOARD_PATH_BY_ROLE[resolvedRole]);
    router.refresh();
  };

  const handleGoogle = async () => {
    if (!role) {
      form.setError("role", { message: "Choose an account type first." });
      return;
    }
    setIsGoogleLoading(true);
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: redirectTo ?? "/dashboard",
      additionalData: { role },
    });
    if (error) {
      setIsGoogleLoading(false);
      toast.error(error.message ?? "Google sign-up could not start. Try again.");
    }
  };

  return (
    <div>
      <p className="eyebrow text-primary">Join EverAfter</p>
      <h1 className="mt-3 font-heading text-[2.1rem] leading-[1.1] tracking-tight sm:text-[2.5rem]">
        Create your <em className="italic text-primary">account</em>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Planning the day, or building a wedding business? Choose where to start.
      </p>

      <fieldset className="mt-7">
        <legend className="text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          I&apos;m signing up as
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
          {ROLE_OPTIONS.map((option) => {
            const selected = role === option.value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => form.setValue("role", option.value, { shouldValidate: true })}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left transition-all",
                  selected
                    ? "border-primary bg-primary/[0.06] ring-1 ring-primary/30"
                    : "border-border bg-card/60 hover:border-foreground/25"
                )}
              >
                <span className="block font-heading text-base leading-tight text-foreground">
                  {option.label}
                </span>
                <span className="mt-0.5 block text-[0.7rem] text-muted-foreground">
                  {option.blurb}
                </span>
              </button>
            );
          })}
        </div>
        {form.formState.errors.role ? (
          <p className="mt-2 text-xs text-destructive">{form.formState.errors.role.message}</p>
        ) : null}
      </fieldset>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Rivera"
            className="h-12 rounded-xl"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register("name")}
          />
          {form.formState.errors.name ? (
            <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
          ) : null}
        </div>

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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 6 characters"
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
          ) : (
            <p className="text-[0.7rem] text-muted-foreground">
              At least 6 characters, one uppercase and one lowercase.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Profile photo</Label>
          <SignUpAvatar
            value={image}
            name={form.getValues("name")}
            onChange={(dataUri) => form.setValue("image", dataUri, { shouldDirty: true })}
            onClear={() => form.setValue("image", "", { shouldDirty: true })}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-12 w-full rounded-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="h-12 w-full gap-2.5 rounded-full"
        onClick={handleGoogle}
        disabled={isGoogleLoading || isSubmitting || !role}
      >
        {isGoogleLoading ? <Loader2 className="size-4 animate-spin" /> : <GoogleIcon className="size-4" />}
        {role
          ? `Continue with Google as a ${role === "vendor" ? "vendor" : "couple"}`
          : "Continue with Google"}
      </Button>
      {!role ? (
        <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
          Choose an account type above to continue with Google.
        </p>
      ) : null}

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={redirectTo ? `/sign-in?redirect=${encodeURIComponent(redirectTo)}` : "/sign-in"}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

export function SignUpForm() {
  return (
    <Suspense fallback={<AuthFormSkeleton withRoleCards />}>
      <SignUpFormInner />
    </Suspense>
  );
}
