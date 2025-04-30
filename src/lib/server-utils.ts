"use server";

export function convertToSlug(text: string) {
  return text
    .toLowerCase() // Convert to lowercase
    .replace(/'/g, "") // Remove apostrophes
    .replace(/[^a-z0-9]+/g, "-") // Replace other non-alphanumeric characters with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
