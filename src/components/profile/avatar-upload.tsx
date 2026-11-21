"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { apiFetch, getErrorMessage } from "@/lib/api";
import { ACCEPTED_IMAGE_TYPES, fileToDataUri, validateImageFile } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  onClear: () => void;
  name: string;
}

/**
 * Single-image variant of `ImageUpload`. The photo goes to ImgBB through the
 * API first; only the returned hosted URL is stored on the user.
 */
export function AvatarUpload({ value, onChange, onClear, name }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      validateImageFile(file);
      const image = await fileToDataUri(file);
      const result = await apiFetch<{ url: string }>("/uploads/image", {
        method: "POST",
        body: { image, name: `${name}-avatar` },
      });
      onChange(result.url);
      toast.success("Photo uploaded. Save your profile to keep it.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
      <div
        className={cn(
          "relative size-20 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-white/60",
          isUploading && "opacity-60"
        )}
      >
        {value ? (
          <Image src={value} alt={name} fill sizes="80px" className="object-cover" />
        ) : (
          <span className="grid h-full place-items-center font-heading text-2xl text-primary">
            {initial}
          </span>
        )}
        {isUploading ? (
          <span className="absolute inset-0 grid place-items-center bg-background/60">
            <Loader2 className="size-5 animate-spin text-primary" />
          </span>
        ) : null}
      </div>

      <div className="space-y-2 text-center sm:text-left">
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-[0.7rem] font-medium tracking-[0.02em] transition-colors hover:border-foreground/30",
              isUploading && "pointer-events-none opacity-60"
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              className="sr-only"
              onChange={(event) => {
                void handleFile(event.target.files);
                event.target.value = "";
              }}
            />
            <Camera className="size-3.5" />
            {value ? "Change photo" : "Upload photo"}
          </label>

          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-full text-destructive hover:text-destructive"
              onClick={onClear}
              disabled={isUploading}
            >
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
        <p className="text-[0.68rem] text-muted-foreground">
          Optional · JPEG, PNG or WebP, 5 MB max.
        </p>
      </div>
    </div>
  );
}
