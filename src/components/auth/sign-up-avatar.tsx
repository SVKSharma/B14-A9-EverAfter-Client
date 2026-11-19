"use client";

import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { ACCEPTED_IMAGE_TYPES, fileToDataUri, validateImageFile } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface SignUpAvatarProps {
  value: string;
  onChange: (dataUri: string) => void;
  onClear: () => void;
  name: string;
}

/**
 * The avatar is held as a data URI until the account exists, because the upload
 * endpoint requires a signed-in session. `SignUpForm` uploads it right after
 * sign-up and saves the returned URL.
 */
export function SignUpAvatar({ value, onChange, onClear, name }: SignUpAvatarProps) {
  const [isReading, setIsReading] = useState(false);

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setIsReading(true);

    try {
      validateImageFile(file);
      onChange(await fileToDataUri(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "That file could not be read.");
    } finally {
      setIsReading(false);
    }
  };

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-secondary ring-1 ring-border/70">
        {value ? (
          <Image src={value} alt="Your photo" fill sizes="64px" className="object-cover" unoptimized />
        ) : (
          <span className="grid h-full place-items-center font-heading text-xl font-semibold text-primary">
            {isReading ? <Loader2 className="size-4 animate-spin" /> : initial}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label
            className={cn(
              "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary",
              isReading && "pointer-events-none opacity-60"
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
            {value ? "Change" : "Add a photo"}
          </label>

          {value ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="size-3" />
              Remove
            </button>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">Optional · JPEG, PNG or WebP up to 5 MB.</p>
      </div>
    </div>
  );
}
