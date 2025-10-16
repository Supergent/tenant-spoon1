import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Distraction-Free Todo List
 *
 * Architecture: Four-layer pattern (db/endpoints/workflows/helpers)
 * User-scoped: All tables include userId for data isolation
 * Real-time: Convex handles synchronization automatically
 */

export default defineSchema({
  /**
   * TODOS TABLE
   * Core entity for todo items with real-time sync
   */
  todos: defineTable({
    userId: v.string(),
    text: v.string(),
    completed: v.boolean(),
    // Optional fields for future enhancements
    priority: v.optional(v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    )),
    dueDate: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_completed", ["userId", "completed"])
    .index("by_user_and_created", ["userId", "createdAt"]),

  /**
   * AGENT THREADS TABLE (for AI assistant features)
   * Tracks conversation threads with the AI agent
   */
  threads: defineTable({
    userId: v.string(),
    title: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"]),

  /**
   * AGENT MESSAGES TABLE
   * Stores conversation history between user and AI agent
   */
  messages: defineTable({
    threadId: v.id("threads"),
    userId: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_thread", ["threadId"])
    .index("by_user", ["userId"]),

  /**
   * EMAIL NOTIFICATIONS TABLE (for Resend integration)
   * Tracks email notification history and preferences
   */
  emailNotifications: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("welcome"),
      v.literal("todo_reminder"),
      v.literal("weekly_summary")
    ),
    recipient: v.string(),
    subject: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed")
    ),
    sentAt: v.optional(v.number()),
    error: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_status_and_created", ["status", "createdAt"]),

  /**
   * USER PREFERENCES TABLE
   * Store user-specific settings and preferences
   */
  userPreferences: defineTable({
    userId: v.string(),
    // Notification settings
    emailNotificationsEnabled: v.boolean(),
    reminderTime: v.optional(v.string()), // Time of day for reminders (e.g., "09:00")
    // Display preferences
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
    defaultView: v.union(v.literal("all"), v.literal("active"), v.literal("completed")),
    // AI assistant preferences
    aiAssistantEnabled: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
