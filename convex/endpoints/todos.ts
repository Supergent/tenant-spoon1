/**
 * Endpoint Layer: Todos
 *
 * Business logic for todo management.
 * Composes database operations from the db layer.
 * Handles authentication and authorization.
 */

import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";
import { rateLimiter } from "../rateLimiter";
import * as Todos from "../db/todos";
import {
  isValidTodoText,
  isValidPriority,
  isValidDueDate,
  isValidTags,
  sanitizeText,
  sanitizeTags,
} from "../helpers/validation";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * List all todos for the authenticated user
 */
export const list = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getTodosByUser(ctx, authUser._id);
  },
});

/**
 * List active (incomplete) todos
 */
export const listActive = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getActiveTodosByUser(ctx, authUser._id);
  },
});

/**
 * List completed todos
 */
export const listCompleted = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    return await Todos.getCompletedTodosByUser(ctx, authUser._id);
  },
});

/**
 * Get todo statistics for the authenticated user
 */
export const stats = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const [total, active, completed] = await Promise.all([
      Todos.countTodosByUser(ctx, authUser._id),
      Todos.countActiveTodosByUser(ctx, authUser._id),
      Todos.countCompletedTodosByUser(ctx, authUser._id),
    ]);

    return {
      total,
      active,
      completed,
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/**
 * Create a new todo
 */
export const create = mutation({
  args: {
    text: v.string(),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "createTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Validation
    const sanitizedText = sanitizeText(args.text);
    if (!isValidTodoText(sanitizedText)) {
      throw new Error(
        "Invalid todo text. Must be non-empty and under 500 characters."
      );
    }

    if (args.priority && !isValidPriority(args.priority)) {
      throw new Error("Invalid priority. Must be 'low', 'medium', or 'high'.");
    }

    if (args.dueDate && !isValidDueDate(args.dueDate)) {
      throw new Error("Invalid due date. Must be in the future.");
    }

    const sanitizedTags = sanitizeTags(args.tags);
    if (sanitizedTags && !isValidTags(sanitizedTags)) {
      throw new Error("Invalid tags. Maximum 10 tags, each under 30 characters.");
    }

    // Create todo
    return await Todos.createTodo(ctx, {
      userId: authUser._id,
      text: sanitizedText,
      priority: args.priority,
      dueDate: args.dueDate,
      tags: sanitizedTags,
    });
  },
});

/**
 * Update a todo's text
 */
export const updateText = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    // Validation
    const sanitizedText = sanitizeText(args.text);
    if (!isValidTodoText(sanitizedText)) {
      throw new Error(
        "Invalid todo text. Must be non-empty and under 500 characters."
      );
    }

    return await Todos.updateTodoText(ctx, args.id, sanitizedText);
  },
});

/**
 * Toggle a todo's completed status
 */
export const toggle = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    return await Todos.toggleTodoCompleted(ctx, args.id);
  },
});

/**
 * Update a todo's priority
 */
export const updatePriority = mutation({
  args: {
    id: v.id("todos"),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "updateTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to update this todo");
    }

    return await Todos.updateTodoPriority(ctx, args.id, args.priority);
  },
});

/**
 * Delete a todo
 */
export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    // Verify ownership
    const todo = await Todos.getTodoById(ctx, args.id);
    if (!todo) {
      throw new Error("Todo not found");
    }
    if (todo.userId !== authUser._id) {
      throw new Error("Not authorized to delete this todo");
    }

    return await Todos.deleteTodo(ctx, args.id);
  },
});

/**
 * Delete all completed todos
 */
export const clearCompleted = mutation({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Rate limiting
    const status = await rateLimiter.limit(ctx, "deleteTodo", {
      key: authUser._id,
    });
    if (!status.ok) {
      throw new Error(
        `Rate limit exceeded. Please try again in ${Math.ceil(status.retryAfter / 1000)} seconds.`
      );
    }

    return await Todos.deleteCompletedTodos(ctx, authUser._id);
  },
});
