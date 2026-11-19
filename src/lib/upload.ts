import { MAX_IMAGE_SIZE_BYTES } from "@/lib/constants";

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export class ImageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImageValidationError";
  }
}

/** Cheap client-side gate so obvious mistakes never hit the network. */
export function validateImageFile(file: File) {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
    throw new ImageValidationError("Use a JPEG, PNG or WebP image.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new ImageValidationError("Images must be 5 MB or smaller.");
  }
}

export function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new ImageValidationError("That file could not be read."));
    reader.readAsDataURL(file);
  });
}
