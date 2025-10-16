/**
 * Database Layer: Email Notifications
 *
 * This is the ONLY file that directly accesses the emailNotifications table using ctx.db.
 * All email notification-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CREATE
// ============================================================================

export async function createEmailNotification(
  ctx: MutationCtx,
  args: {
    userId: string;
    type: "welcome" | "todo_reminder" | "weekly_summary";
    recipient: string;
    subject: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("emailNotifications", {
    ...args,
    status: "pending",
    createdAt: now,
  });
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get an email notification by its ID
 */
export async function getEmailNotificationById(
  ctx: QueryCtx,
  id: Id<"emailNotifications">
) {
  return await ctx.db.get(id);
}

/**
 * Get all email notifications for a user
 */
export async function getEmailNotificationsByUser(
  ctx: QueryCtx,
  userId: string
) {
  return await ctx.db
    .query("emailNotifications")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get email notifications by user and status
 */
export async function getEmailNotificationsByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "pending" | "sent" | "failed"
) {
  return await ctx.db
    .query("emailNotifications")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * Get pending email notifications by status
 */
export async function getPendingEmailNotifications(ctx: QueryCtx) {
  return await ctx.db
    .query("emailNotifications")
    .withIndex("by_status_and_created", (q) => q.eq("status", "pending"))
    .order("asc")
    .collect();
}

/**
 * Get failed email notifications
 */
export async function getFailedEmailNotifications(ctx: QueryCtx) {
  return await ctx.db
    .query("emailNotifications")
    .withIndex("by_status_and_created", (q) => q.eq("status", "failed"))
    .order("desc")
    .collect();
}

// ============================================================================
// UPDATE
// ============================================================================

/**
 * Mark an email notification as sent
 */
export async function markEmailNotificationSent(
  ctx: MutationCtx,
  id: Id<"emailNotifications">
) {
  return await ctx.db.patch(id, {
    status: "sent",
    sentAt: Date.now(),
  });
}

/**
 * Mark an email notification as failed
 */
export async function markEmailNotificationFailed(
  ctx: MutationCtx,
  id: Id<"emailNotifications">,
  error: string
) {
  return await ctx.db.patch(id, {
    status: "failed",
    error,
  });
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete an email notification
 */
export async function deleteEmailNotification(
  ctx: MutationCtx,
  id: Id<"emailNotifications">
) {
  return await ctx.db.delete(id);
}
