"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { profileSchema, type ProfileFormValues } from "@/lib/schemas/profile";
import { ROLE_LABELS } from "@/lib/constants";
import type { ProfileUser } from "@/types";

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
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <Card className="border-border/80">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Edit profile</CardTitle>
          <CardDescription>
            Update how you appear across EverAfter. Role and plan are managed by the platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <AvatarUpload
              value={image}
              name={name}
              onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
              onClear={() => form.setValue("image", "", { shouldDirty: true })}
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                className="h-11"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
              ) : null}
            </div>

            {isVendor ? (
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  autoComplete="organization"
                  placeholder="e.g. Aurora Events & Florals"
                  className="h-11"
                  aria-invalid={Boolean(form.formState.errors.businessName)}
                  {...form.register("businessName")}
                />
                {form.formState.errors.businessName ? (
                  <p className="text-xs text-destructive">
                    {form.formState.errors.businessName.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Shown on your service cards instead of your personal name.
                  </p>
                )}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user.email}
                readOnly
                disabled
                className="h-11 bg-secondary/40"
              />
              <p className="text-xs text-muted-foreground">
                Changing your email needs a verification flow, so it is not editable here.
              </p>
            </div>

            <Button type="submit" size="lg" className="h-11 w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="h-fit border-border/80 bg-secondary/20">
        <CardHeader>
          <CardTitle className="font-heading text-xl">Account</CardTitle>
          <CardDescription>Managed by EverAfter.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-border/70">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd className="text-sm font-medium">{ROLE_LABELS[user.role]}</dd>
            </div>
            {isVendor ? (
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="text-sm text-muted-foreground">Plan</dt>
                <dd className="text-sm font-medium">
                  {user.subscriptionPlan === "premium" ? "Premium" : "Free"}
                </dd>
              </div>
            ) : null}
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="truncate text-sm font-medium">{user.email}</dd>
            </div>
          </dl>
          <p className="mt-3 rounded-lg bg-background/70 px-3 py-2 text-xs text-muted-foreground">
            Need a different role or account type? Contact an administrator.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
