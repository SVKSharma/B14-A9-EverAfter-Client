"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { apiFetch, getErrorMessage } from "@/lib/api";
import { MAX_SERVICE_IMAGES } from "@/lib/constants";
import { ACCEPTED_IMAGE_TYPES, fileToDataUri, validateImageFile } from "@/lib/upload";
import { cn } from "@/lib/utils";

interface UploadedImage {
  url: string;
  thumbnailUrl?: string;
}

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
}

export function ImageUpload({ value, onChange, max = MAX_SERVICE_IMAGES, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const canAdd = value.length < max;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const room = max - value.length;
    const selected = Array.from(files).slice(0, room);

    if (files.length > room) {
      toast.error(`You can upload ${max} images in total.`);
    }

    setIsUploading(true);

    try {
      const uploaded: string[] = [];

      for (const file of selected) {
        validateImageFile(file);
        const image = await fileToDataUri(file);
        const result = await apiFetch<UploadedImage>("/uploads/image", {
          method: "POST",
          body: { image, name: file.name },
        });
        uploaded.push(result.url);
      }

      onChange([...value, ...uploaded]);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, position) => position !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border/80 bg-secondary/40"
          >
            <Image
              src={url}
              alt={`${label ?? "Service"} image ${index + 1}`}
              fill
              sizes="(max-width: 640px) 45vw, 160px"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-background/90 text-foreground shadow-sm transition-opacity hover:bg-destructive hover:text-white"
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}

        {canAdd ? (
          <label
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-secondary/20 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50",
              isUploading && "pointer-events-none opacity-60"
            )}
          >
            <input
              type="file"
              accept={ACCEPTED_IMAGE_TYPES.join(",")}
              multiple
              className="sr-only"
              onChange={(event) => {
                void handleFiles(event.target.files);
                event.target.value = "";
              }}
            />
            {isUploading ? (
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            ) : (
              <ImagePlus className="size-5 text-muted-foreground" />
            )}
            <span className="px-2 text-[11px] leading-tight text-muted-foreground">
              {isUploading ? "Uploading..." : "Add photo"}
            </span>
          </label>
        ) : null}
      </div>

      <p className="text-xs text-muted-foreground">
        {value.length} of {max} photos · JPEG, PNG or WebP up to 5 MB each.
      </p>
    </div>
  );
}
