/**
 * String and input sanitation utilities
 */

export function sanitizeSlug(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeSearchQuery(input: string): string {
  if (!input || typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, 100) // limit length
    .replace(/[<>'"`;\\]/g, ""); // strip script-injection characters
}

export function truncateText(text: string, maxLength: number = 150): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}
