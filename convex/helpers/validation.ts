/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * Validate todo text (must be non-empty and under 500 characters)
 */
export function isValidTodoText(text: string): boolean {
  return text.trim().length > 0 && text.length <= 500;
}

/**
 * Validate thread title (must be under 200 characters if provided)
 */
export function isValidThreadTitle(title?: string): boolean {
  if (!title) return true; // Optional field
  return title.length <= 200;
}

/**
 * Validate message content (must be non-empty and under 5000 characters)
 */
export function isValidMessageContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 5000;
}

/**
 * Validate reminder time format (HH:MM)
 */
export function isValidReminderTime(time?: string): boolean {
  if (!time) return true; // Optional field
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return pattern.test(time);
}

/**
 * Validate priority value
 */
export function isValidPriority(
  priority?: string
): priority is "low" | "medium" | "high" | undefined {
  if (!priority) return true;
  return ["low", "medium", "high"].includes(priority);
}

/**
 * Validate due date (must be in the future)
 */
export function isValidDueDate(dueDate?: number): boolean {
  if (!dueDate) return true; // Optional field
  return dueDate > Date.now();
}

/**
 * Validate tags array (max 10 tags, each under 30 characters)
 */
export function isValidTags(tags?: string[]): boolean {
  if (!tags) return true; // Optional field
  if (tags.length > 10) return false;
  return tags.every((tag) => tag.length > 0 && tag.length <= 30);
}

/**
 * Sanitize text input (trim and remove excessive whitespace)
 */
export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/**
 * Sanitize tags (trim, lowercase, remove duplicates)
 */
export function sanitizeTags(tags?: string[]): string[] | undefined {
  if (!tags || tags.length === 0) return undefined;

  const sanitized = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  // Remove duplicates
  return Array.from(new Set(sanitized));
}
