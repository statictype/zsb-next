import type { ImageData } from "@/types/edition";

/**
 * Build a src string from ImageData, encoding widths and ext
 * as query params so the custom image loader can use them.
 */
export function imageSrc(image: ImageData): string {
  const params = new URLSearchParams();
  if (image.widths) params.set("widths", image.widths.join(","));
  if (image.ext) params.set("ext", image.ext);
  const query = params.toString();
  return query ? `${image.basePath}?${query}` : image.basePath;
}
