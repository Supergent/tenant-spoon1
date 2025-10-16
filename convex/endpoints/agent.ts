/**
 * Endpoint Layer: AI Agent
 *
 * Business logic for AI assistant interactions.
 * Manages threads and messages with the AI agent.
 */

import { v } from "convex/values";
import { mutation, query, action } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import { assistant } from "../agent";
import * as Threads from "../db/threads";
import * as Messages from "../db/messages";
import * as UserPreferences from "../db/userPreferences";
import * as Todos from "../db/todos";
import { isValidThreadTitle, isValidMessageContent, sanitizeText } from "../helpers/validation";
import { internal } from "../_generated/api";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List all threads for the authenticated user
 */
export const listThreads = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Threads.getThreadsByUser(ctx, authUser._id);
  },
});

/**
 * Get messages for a thread
 */
export const getMessages = query({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify thread ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to view this thread");
    }

    return await Messages.getMessagesByThread(ctx, args.threadId);
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new thread
 */
export const createThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Check if AI assistant is enabled
    const preferences = await UserPreferences.getUserPreferencesByUserId(
      ctx,
      authUser._id
    );
    if (preferences && !preferences.aiAssistantEnabled) {
      throw new Error("AI assistant is disabled in your preferences");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "createThread", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Validation
    if (args.title) {
      const sanitizedTitle = sanitizeText(args.title);
      if (!isValidThreadTitle(sanitizedTitle)) {
        throw new Error("Invalid thread title. Must be under 200 characters.");
      }
      args.title = sanitizedTitle;
    }

    return await Threads.createThread(ctx, {
      userId: authUser._id,
      title: args.title,
    });
  },
});

/**
 * Archive a thread
 */
export const archiveThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to archive this thread");
    }

    return await Threads.archiveThread(ctx, args.threadId);
  },
});

/**
 * Delete a thread
 */
export const deleteThread = mutation({
  args: {
    threadId: v.id("threads"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Verify ownership
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread) {
      throw new Error("Thread not found");
    }
    if (thread.userId !== authUser._id) {
      throw new Error("Not authorized to delete this thread");
    }

    // Delete all messages in the thread first
    await Messages.deleteMessagesByThread(ctx, args.threadId);

    // Delete the thread
    return await Threads.deleteThread(ctx, args.threadId);
  },
});

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Send a message to the AI agent
 */
export const sendMessage = action({
  args: {
    threadId: v.id("threads"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "sendMessage", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Validation
    const sanitizedContent = sanitizeText(args.content);
    if (!isValidMessageContent(sanitizedContent)) {
      throw new Error(
        "Invalid message content. Must be non-empty and under 5000 characters."
      );
    }

    // Verify thread ownership
    const thread = await ctx.runQuery(internal.endpoints.agent.verifyThreadOwnership, {
      threadId: args.threadId,
      userId: authUser._id,
    });

    if (!thread) {
      throw new Error("Thread not found or not authorized");
    }

    // Save user message
    await ctx.runMutation(internal.endpoints.agent.saveMessage, {
      threadId: args.threadId,
      userId: authUser._id,
      role: "user",
      content: sanitizedContent,
    });

    // Get user's todos for context
    const todos = await ctx.runQuery(internal.endpoints.agent.getUserTodosForContext, {
      userId: authUser._id,
    });

    // Build context for the AI
    const context = `
User has ${todos.total} total todos (${todos.active} active, ${todos.completed} completed).

Active todos:
${todos.activeTodos.map((t, i) => `${i + 1}. ${t.text}${t.priority ? ` [${t.priority}]` : ""}`).join("\n")}

User's question: ${sanitizedContent}
    `.trim();

    // Get AI response (simplified - in production you'd use the Agent component properly)
    const aiResponse = `I understand you have ${todos.active} active todos. How can I help you manage them better?`;

    // Save assistant message
    await ctx.runMutation(internal.endpoints.agent.saveMessage, {
      threadId: args.threadId,
      userId: authUser._id,
      role: "assistant",
      content: aiResponse,
    });

    return {
      message: aiResponse,
    };
  },
});

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

export const verifyThreadOwnership = query({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const thread = await Threads.getThreadById(ctx, args.threadId);
    if (!thread || thread.userId !== args.userId) {
      return null;
    }
    return thread;
  },
});

export const saveMessage = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await Messages.createMessage(ctx, args);
  },
});

export const getUserTodosForContext = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const [activeTodos, total, active, completed] = await Promise.all([
      Todos.getActiveTodosByUser(ctx, args.userId),
      Todos.countTodosByUser(ctx, args.userId),
      Todos.countActiveTodosByUser(ctx, args.userId),
      Todos.countCompletedTodosByUser(ctx, args.userId),
    ]);

    return {
      activeTodos: activeTodos.slice(0, 10), // Limit to 10 for context
      total,
      active,
      completed,
    };
  },
});
