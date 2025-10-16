/**
 * Endpoint Layer: User Preferences
 *
 * Business logic for user preferences management.
 * Composes database operations from the db layer.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as UserPreferences from "../db/userPreferences";
import { isValidReminderTime } from "../helpers/validation";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get user preferences (creates default if not exists)
 */
export const get = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await UserPreferences.getUserPreferencesByUserId(ctx, authUser._id);
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Initialize user preferences (called after signup)
 */
export const initialize = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if preferences already exist
    const existing = await UserPreferences.getUserPreferencesByUserId(
      ctx,
      authUser._id
    );
    if (existing) {
      return existing._id;
    }

    // Create default preferences
    return await UserPreferences.createUserPreferences(ctx, {
      userId: authUser._id,
    });
  },
});

/**
 * Update user preferences
 */
export const update = mutation({
  args: {
    emailNotificationsEnabled: v.optional(v.boolean()),
    reminderTime: v.optional(v.string()),
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    defaultView: v.optional(v.union(v.literal("all"), v.literal("active"), v.literal("completed"))),
    aiAssistantEnabled: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Validation
    if (args.reminderTime && !isValidReminderTime(args.reminderTime)) {
      throw new Error("Invalid reminder time. Must be in HH:MM format.");
    }

    // Update preferences
    return await UserPreferences.updateUserPreferences(ctx, authUser._id, args);
  },
});

/**
 * Toggle email notifications
 */
export const toggleEmailNotifications = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    return await UserPreferences.toggleEmailNotifications(ctx, authUser._id);
  },
});

/**
 * Toggle AI assistant
 */
export const toggleAiAssistant = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updatePreferences", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    return await UserPreferences.toggleAiAssistant(ctx, authUser._id);
  },
});
