/**
 * Database Layer: Threads
 *
 * This is the ONLY file that directly accesses the threads table using ctx.db.
 * All thread-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CREATE
// ============================================================================

export async function createThread(
  ctx: MutationCtx,
  args: {
    userId: string;
    title?: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("threads", {
    userId: args.userId,
    title: args.title,
    status: "active",
    createdAt: now,
    updatedAt: now,
  });
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get a thread by its ID
 */
export async function getThreadById(ctx: QueryCtx, id: Id<"threads">) {
  return await ctx.db.get(id);
}

/**
 * Get all threads for a user
 */
export async function getThreadsByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("threads")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get threads by user and status
 */
export async function getThreadsByUserAndStatus(
  ctx: QueryCtx,
  userId: string,
  status: "active" | "archived"
) {
  return await ctx.db
    .query("threads")
    .withIndex("by_user_and_status", (q) =>
      q.eq("userId", userId).eq("status", status)
    )
    .order("desc")
    .collect();
}

/**
 * Get active threads for a user
 */
export async function getActiveThreadsByUser(ctx: QueryCtx, userId: string) {
  return getThreadsByUserAndStatus(ctx, userId, "active");
}

/**
 * Get archived threads for a user
 */
export async function getArchivedThreadsByUser(ctx: QueryCtx, userId: string) {
  return getThreadsByUserAndStatus(ctx, userId, "archived");
}

// ============================================================================
// UPDATE
// ============================================================================

/**
 * Update thread title
 */
export async function updateThreadTitle(
  ctx: MutationCtx,
  id: Id<"threads">,
  title: string
) {
  return await ctx.db.patch(id, {
    title,
    updatedAt: Date.now(),
  });
}

/**
 * Archive a thread
 */
export async function archiveThread(ctx: MutationCtx, id: Id<"threads">) {
  return await ctx.db.patch(id, {
    status: "archived",
    updatedAt: Date.now(),
  });
}

/**
 * Unarchive a thread
 */
export async function unarchiveThread(ctx: MutationCtx, id: Id<"threads">) {
  return await ctx.db.patch(id, {
    status: "active",
    updatedAt: Date.now(),
  });
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete a thread
 */
export async function deleteThread(ctx: MutationCtx, id: Id<"threads">) {
  return await ctx.db.delete(id);
}
