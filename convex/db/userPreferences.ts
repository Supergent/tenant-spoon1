/**
 * Database Layer: User Preferences
 *
 * This is the ONLY file that directly accesses the userPreferences table using ctx.db.
 * All user preferences-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CREATE
// ============================================================================

export async function createUserPreferences(
  ctx: MutationCtx,
  args: {
    userId: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("userPreferences", {
    userId: args.userId,
    // Default preferences
    emailNotificationsEnabled: true,
    theme: "system",
    defaultView: "all",
    aiAssistantEnabled: true,
    createdAt: now,
    updatedAt: now,
  });
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get user preferences by ID
 */
export async function getUserPreferencesById(
  ctx: QueryCtx,
  id: Id<"userPreferences">
) {
  return await ctx.db.get(id);
}

/**
 * Get user preferences by user ID
 */
export async function getUserPreferencesByUserId(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("userPreferences")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
}

/**
 * Get or create user preferences (ensures preferences always exist)
 */
export async function getOrCreateUserPreferences(
  ctx: MutationCtx,
  userId: string
) {
  const existing = await getUserPreferencesByUserId(ctx, userId);
  if (existing) {
    return existing;
  }

  const id = await createUserPreferences(ctx, { userId });
  const created = await ctx.db.get(id);
  if (!created) {
    throw new Error("Failed to create user preferences");
  }
  return created;
}

// ============================================================================
// UPDATE
// ============================================================================

/**
 * Update user preferences
 */
export async function updateUserPreferences(
  ctx: MutationCtx,
  userId: string,
  updates: {
    emailNotificationsEnabled?: boolean;
    reminderTime?: string;
    theme?: "light" | "dark" | "system";
    defaultView?: "all" | "active" | "completed";
    aiAssistantEnabled?: boolean;
  }
) {
  const preferences = await getUserPreferencesByUserId(ctx, userId);
  if (!preferences) {
    throw new Error("User preferences not found");
  }

  return await ctx.db.patch(preferences._id, {
    ...updates,
    updatedAt: Date.now(),
  });
}

/**
 * Toggle email notifications
 */
export async function toggleEmailNotifications(
  ctx: MutationCtx,
  userId: string
) {
  const preferences = await getUserPreferencesByUserId(ctx, userId);
  if (!preferences) {
    throw new Error("User preferences not found");
  }

  return await ctx.db.patch(preferences._id, {
    emailNotificationsEnabled: !preferences.emailNotificationsEnabled,
    updatedAt: Date.now(),
  });
}

/**
 * Toggle AI assistant
 */
export async function toggleAiAssistant(ctx: MutationCtx, userId: string) {
  const preferences = await getUserPreferencesByUserId(ctx, userId);
  if (!preferences) {
    throw new Error("User preferences not found");
  }

  return await ctx.db.patch(preferences._id, {
    aiAssistantEnabled: !preferences.aiAssistantEnabled,
    updatedAt: Date.now(),
  });
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete user preferences
 */
export async function deleteUserPreferences(
  ctx: MutationCtx,
  userId: string
) {
  const preferences = await getUserPreferencesByUserId(ctx, userId);
  if (preferences) {
    await ctx.db.delete(preferences._id);
  }
}
