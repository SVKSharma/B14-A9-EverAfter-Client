import { z } from "zod";
import { CATEGORY_VALUES, MAX_SERVICE_IMAGES } from "@/lib/constants";

export const serviceSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(3, "Give your service a name of at least 3 characters.")
    .max(120, "Service name is too long."),
  description: z
    .string()
    .trim()
    .min(20, "Describe your service in at least 20 characters.")
    .max(2000, "Description is too long."),
  category: z.enum(CATEGORY_VALUES, { error: "Choose a category." }),
  price: z
    .number({ error: "Enter a price." })
    .min(0, "Price cannot be negative.")
    .max(10_000_000, "Price is too high."),
  location: z
    .string()
    .trim()
    .min(2, "Where do you provide this service?")
    .max(120, "Location is too long."),
  images: z
    .array(z.string())
    .min(1, "Upload at least one photo.")
    .max(MAX_SERVICE_IMAGES, `You can add up to ${MAX_SERVICE_IMAGES} photos.`),
  availability: z.boolean(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;
