/**
 * Database Layer: Messages
 *
 * This is the ONLY file that directly accesses the messages table using ctx.db.
 * All message-related database operations are defined here as pure async functions.
 */

import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

// ============================================================================
// CREATE
// ============================================================================

export async function createMessage(
  ctx: MutationCtx,
  args: {
    threadId: Id<"threads">;
    userId: string;
    role: "user" | "assistant";
    content: string;
  }
) {
  const now = Date.now();
  return await ctx.db.insert("messages", {
    ...args,
    createdAt: now,
  });
}

// ============================================================================
// READ
// ============================================================================

/**
 * Get a message by its ID
 */
export async function getMessageById(ctx: QueryCtx, id: Id<"messages">) {
  return await ctx.db.get(id);
}

/**
 * Get all messages for a thread
 */
export async function getMessagesByThread(
  ctx: QueryCtx,
  threadId: Id<"threads">
) {
  return await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("asc")
    .collect();
}

/**
 * Get all messages for a user
 */
export async function getMessagesByUser(ctx: QueryCtx, userId: string) {
  return await ctx.db
    .query("messages")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .order("desc")
    .collect();
}

/**
 * Get the last N messages for a thread
 */
export async function getRecentMessagesByThread(
  ctx: QueryCtx,
  threadId: Id<"threads">,
  limit: number = 10
) {
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_thread", (q) => q.eq("threadId", threadId))
    .order("desc")
    .take(limit);

  // Reverse to get chronological order
  return messages.reverse();
}

// ============================================================================
// DELETE
// ============================================================================

/**
 * Delete a message
 */
export async function deleteMessage(ctx: MutationCtx, id: Id<"messages">) {
  return await ctx.db.delete(id);
}

/**
 * Delete all messages for a thread
 */
export async function deleteMessagesByThread(
  ctx: MutationCtx,
  threadId: Id<"threads">
) {
  const messages = await getMessagesByThread(ctx, threadId);
  await Promise.all(messages.map((message) => ctx.db.delete(message._id)));
  return messages.length;
}
