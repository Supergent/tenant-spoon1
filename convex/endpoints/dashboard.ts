/**
 * Endpoint Layer: Dashboard
 *
 * Provides summary statistics and recent data for the dashboard.
 * This is the main entry point for dashboard widgets.
 */

import { query } from "../_generated/server";
import { authComponent } from "../auth";
import * as Todos from "../db/todos";
import type { QueryCtx } from "../_generated/server";
import type { DataModel } from "../_generated/dataModel";

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get dashboard summary statistics
 * Returns aggregate counts for dashboard widgets
 */
export const summary = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get todo statistics
    const [totalTodos, activeTodos, completedTodos] = await Promise.all([
      Todos.countTodosByUser(ctx, authUser._id),
      Todos.countActiveTodosByUser(ctx, authUser._id),
      Todos.countCompletedTodosByUser(ctx, authUser._id),
    ]);

    // Calculate completion rate
    const completionRate =
      totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

    return {
      totalTodos,
      activeTodos,
      completedTodos,
      completionRate,
      // Additional metrics can be added here
      lastUpdated: Date.now(),
    };
  },
});

/**
 * Get recent todos for the dashboard table view
 * Returns the latest todos across all statuses
 */
export const recent = query({
  args: {},
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Get all todos, limited to most recent 20
    const allTodos = await Todos.getTodosByUser(ctx, authUser._id);

    return allTodos.slice(0, 20).map((todo) => ({
      _id: todo._id,
      text: todo.text,
      completed: todo.completed,
      priority: todo.priority,
      createdAt: todo.createdAt,
      completedAt: todo.completedAt,
      tags: todo.tags,
    }));
  },
});

/**
 * Get detailed analytics for the dashboard
 */
export const analytics = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const allTodos = await Todos.getTodosByUser(ctx, authUser._id);

    // Count by priority
    const byPriority = {
      high: 0,
      medium: 0,
      low: 0,
      none: 0,
    };

    allTodos.forEach((todo) => {
      if (!todo.completed) {
        if (todo.priority === "high") byPriority.high++;
        else if (todo.priority === "medium") byPriority.medium++;
        else if (todo.priority === "low") byPriority.low++;
        else byPriority.none++;
      }
    });

    // Count todos created in last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const createdThisWeek = allTodos.filter(
      (todo) => todo.createdAt > weekAgo
    ).length;
    const completedThisWeek = allTodos.filter(
      (todo) => todo.completedAt && todo.completedAt > weekAgo
    ).length;

    return {
      byPriority,
      thisWeek: {
        created: createdThisWeek,
        completed: completedThisWeek,
      },
    };
  },
});

/**
 * Load database summary for all tables (admin/debug view)
 */
export const loadSummary = query({
  handler: async (ctx) => {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) {
      throw new Error("Not authenticated");
    }

    // Tables to query - use type assertion for dynamic table access
    const TABLES = [
      "todos",
      "threads",
      "messages",
      "emailNotifications",
      "userPreferences",
    ] as const;

    const perTable: Record<string, number> = {};

    for (const table of TABLES) {
      // Use type assertion to tell TypeScript this is a valid table name
      const records = await ctx.db.query(table as keyof DataModel).collect();

      // Filter by userId for user-scoped tables
      const scopedRecords = records.filter((record: any) => {
        return record.userId === authUser._id;
      });

      perTable[table] = scopedRecords.length;
    }

    const totalRecords = Object.values(perTable).reduce((a, b) => a + b, 0);

    return {
      perTable,
      totalRecords,
      userId: authUser._id,
    };
  },
});
