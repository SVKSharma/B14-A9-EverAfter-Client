"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas/profile";
import { ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import type { ProfileUser } from "@/types";

function Field({
  index,
  label,
  hint,
  htmlFor,
  error,
  children,
}: {
  index: string;
  label: string;
  hint?: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-border/70 pt-6 first:border-t-0 first:pt-0">
      <div className="flex gap-4">
        <span className="hidden pt-0.5 font-heading text-xs text-muted-foreground/50 tabular-nums sm:block">
          {index}
        </span>
        <div className="min-w-0 flex-1 space-y-2">
          <Label htmlFor={htmlFor} className="text-[0.7rem] tracking-[0.12em] uppercase">
            {label}
          </Label>
          {children}
          {error ? (
            <p className="text-xs text-destructive">{error}</p>
          ) : hint ? (
            <p className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      businessName: user.businessName ?? "",
      image: user.image ?? "",
    },
    mode: "onTouched",
  });

  const image = useWatch({ control: form.control, name: "image" }) || null;
  const name = useWatch({ control: form.control, name: "name" }) ?? user.name;
  const isVendor = user.role === "vendor";
  const isPremium = user.subscriptionPlan === "premium";

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);

    try {
      const body: Record<string, unknown> = { name: values.name };
      // Only vendors own a business name; sending it for other roles would be
      // rejected by the API anyway.
      if (isVendor) body.businessName = values.businessName ?? "";
      body.image = values.image ? values.image : null;

      await apiFetch("/users/me", { method: "PATCH", body });

      toast.success("Profile updated");
      router.refresh();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:gap-8">
      <section className="rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl sm:p-7">
        <div className="border-b border-border/70 pb-6">
          <p className="eyebrow text-primary">Identity</p>
          <h2 className="mt-2.5 font-heading text-xl leading-tight tracking-tight">
            Edit profile
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            Update how you appear across EverAfter. Role and plan are managed by the platform.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-6" noValidate>
          <AvatarUpload
            value={image}
            name={name}
            onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
            onClear={() => form.setValue("image", "", { shouldDirty: true })}
          />

          <Field
            index="01"
            label="Full name"
            htmlFor="name"
            error={form.formState.errors.name?.message}
          >
            <Input
              id="name"
              autoComplete="name"
              className="h-11 rounded-xl"
              aria-invalid={Boolean(form.formState.errors.name)}
              {...form.register("name")}
            />
          </Field>

          {isVendor ? (
            <Field
              index="02"
              label="Business name"
              htmlFor="businessName"
              hint="Shown on your service cards instead of your personal name."
              error={form.formState.errors.businessName?.message}
            >
              <Input
                id="businessName"
                autoComplete="organization"
                placeholder="e.g. Aurora Events & Florals"
                className="h-11 rounded-xl"
                aria-invalid={Boolean(form.formState.errors.businessName)}
                {...form.register("businessName")}
              />
            </Field>
          ) : null}

          <Field
            index={isVendor ? "03" : "02"}
            label="Email"
            htmlFor="email"
            hint="Changing your email needs a verification flow, so it is not editable here."
          >
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                value={user.email}
                readOnly
                disabled
                className="h-11 rounded-xl bg-secondary/40 pl-9"
              />
            </div>
          </Field>

          <div className="flex flex-col gap-2 border-t border-border/70 pt-6 sm:flex-row">
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-full px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </section>

      <aside className="h-fit space-y-5 lg:sticky lg:top-24">
        <div className="glass-strong rounded-2xl p-6">
          <p className="eyebrow text-muted-foreground">Account</p>
          <p className="mt-2 font-heading text-lg leading-tight tracking-tight">
            Managed by EverAfter
          </p>

          <dl className="mt-5 divide-y divide-border/70">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd>
                <span className="inline-flex h-6 items-center rounded-full border border-border bg-background px-2.5 text-[0.62rem] tracking-[0.1em] text-foreground uppercase">
                  {ROLE_LABELS[user.role]}
                </span>
              </dd>
            </div>
            {isVendor ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Plan</dt>
                <dd>
                  <span
                    className={
                      isPremium
                        ? "inline-flex h-6 items-center rounded-full bg-gold px-2.5 text-[0.62rem] tracking-[0.1em] text-white uppercase"
                        : "inline-flex h-6 items-center rounded-full border border-border bg-background px-2.5 text-[0.62rem] tracking-[0.1em] text-muted-foreground uppercase"
                    }
                  >
                    {isPremium ? "Premium" : "Free"}
                  </span>
                </dd>
              </div>
            ) : null}
            {user.createdAt ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Member since</dt>
                <dd className="text-sm font-medium text-foreground">{formatDate(user.createdAt)}</dd>
              </div>
            ) : null}
            <div className="flex items-start justify-between gap-4 py-3">
              <dt className="shrink-0 text-sm text-muted-foreground">Email</dt>
              <dd className="min-w-0 truncate text-right text-sm font-medium text-foreground">
                {user.email}
              </dd>
            </div>
          </dl>

          {user.isBlocked ? (
            <p className="mt-4 rounded-xl border border-destructive/25 bg-destructive/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-destructive">
              This account is blocked, so you cannot book or publish right now.
            </p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
          <p className="flex items-center gap-2 text-xs font-medium text-foreground">
            <ShieldCheck className="size-3.5 text-primary" strokeWidth={1.8} />
            Need a different role?
          </p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Account type is fixed at sign-up to keep the marketplace trustworthy. Contact an
            administrator if it needs to change.
          </p>
        </div>
      </aside>
    </div>
  );
}
