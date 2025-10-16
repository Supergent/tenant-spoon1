/**
 * Endpoint Layer: Email Notifications
 *
 * Business logic for sending email notifications.
 * Handles welcome emails, reminders, and weekly summaries.
 */

import { v } from "convex/values";
import { internalMutation, internalAction } from "../_generated/server";
import { resend, FROM_EMAIL, FROM_NAME, getWelcomeEmailHtml, getTodoReminderEmailHtml, getWeeklySummaryEmailHtml } from "../email";
import * as EmailNotifications from "../db/emailNotifications";
import * as UserPreferences from "../db/userPreferences";
import * as Todos from "../db/todos";
import { EMAIL_SUBJECTS } from "../helpers/constants";

// ============================================================================
// INTERNAL MUTATIONS (called from actions)
// ============================================================================

/**
 * Create a welcome email notification record
 */
export const createWelcomeNotification = internalMutation({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await EmailNotifications.createEmailNotification(ctx, {
      userId: args.userId,
      type: "welcome",
      recipient: args.email,
      subject: EMAIL_SUBJECTS.WELCOME,
    });
  },
});

/**
 * Mark email notification as sent
 */
export const markNotificationSent = internalMutation({
  args: {
    notificationId: v.id("emailNotifications"),
  },
  handler: async (ctx, args) => {
    return await EmailNotifications.markEmailNotificationSent(
      ctx,
      args.notificationId
    );
  },
});

/**
 * Mark email notification as failed
 */
export const markNotificationFailed = internalMutation({
  args: {
    notificationId: v.id("emailNotifications"),
    error: v.string(),
  },
  handler: async (ctx, args) => {
    return await EmailNotifications.markEmailNotificationFailed(
      ctx,
      args.notificationId,
      args.error
    );
  },
});

// ============================================================================
// INTERNAL ACTIONS (send actual emails)
// ============================================================================

/**
 * Send welcome email to a new user
 */
export const sendWelcomeEmail = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // Create notification record
      const notificationId = await ctx.runMutation(
        createWelcomeNotification,
        {
          userId: args.userId,
          email: args.email,
        }
      );

      // Send email via Resend
      await resend.sendEmail(ctx, {
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: args.email,
        subject: EMAIL_SUBJECTS.WELCOME,
        html: getWelcomeEmailHtml(args.name),
      });

      // Mark as sent
      await ctx.runMutation(markNotificationSent, {
        notificationId,
      });

      return { success: true };
    } catch (error) {
      // Mark as failed
      if (error instanceof Error) {
        await ctx.runMutation(markNotificationFailed, {
          notificationId: "", // Would need to store this
          error: error.message,
        });
      }
      throw error;
    }
  },
});

/**
 * Send todo reminder email
 */
export const sendTodoReminder = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user preferences
    const preferences = await ctx.runQuery(
      async (ctx) => {
        return await UserPreferences.getUserPreferencesByUserId(
          ctx,
          args.userId
        );
      }
    );

    // Check if email notifications are enabled
    if (!preferences || !preferences.emailNotificationsEnabled) {
      return { success: false, reason: "Email notifications disabled" };
    }

    // Get active todos
    const activeTodos = await ctx.runQuery(
      async (ctx) => {
        return await Todos.getActiveTodosByUser(ctx, args.userId);
      }
    );

    // Don't send if no active todos
    if (activeTodos.length === 0) {
      return { success: false, reason: "No active todos" };
    }

    try {
      // Create notification record
      const notificationId = await ctx.runMutation(
        async (ctx) => {
          return await EmailNotifications.createEmailNotification(ctx, {
            userId: args.userId,
            type: "todo_reminder",
            recipient: args.email,
            subject: EMAIL_SUBJECTS.TODO_REMINDER,
          });
        }
      );

      // Send email
      await resend.sendEmail(ctx, {
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: args.email,
        subject: EMAIL_SUBJECTS.TODO_REMINDER,
        html: getTodoReminderEmailHtml(activeTodos.length, activeTodos),
      });

      // Mark as sent
      await ctx.runMutation(markNotificationSent, {
        notificationId,
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
});

/**
 * Send weekly summary email
 */
export const sendWeeklySummary = internalAction({
  args: {
    userId: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    // Get user preferences
    const preferences = await ctx.runQuery(
      async (ctx) => {
        return await UserPreferences.getUserPreferencesByUserId(
          ctx,
          args.userId
        );
      }
    );

    // Check if email notifications are enabled
    if (!preferences || !preferences.emailNotificationsEnabled) {
      return { success: false, reason: "Email notifications disabled" };
    }

    // Get todo statistics
    const [total, active, completed] = await Promise.all([
      ctx.runQuery(async (ctx) => Todos.countTodosByUser(ctx, args.userId)),
      ctx.runQuery(async (ctx) => Todos.countActiveTodosByUser(ctx, args.userId)),
      ctx.runQuery(async (ctx) => Todos.countCompletedTodosByUser(ctx, args.userId)),
    ]);

    try {
      // Create notification record
      const notificationId = await ctx.runMutation(
        async (ctx) => {
          return await EmailNotifications.createEmailNotification(ctx, {
            userId: args.userId,
            type: "weekly_summary",
            recipient: args.email,
            subject: EMAIL_SUBJECTS.WEEKLY_SUMMARY,
          });
        }
      );

      // Send email
      await resend.sendEmail(ctx, {
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: args.email,
        subject: EMAIL_SUBJECTS.WEEKLY_SUMMARY,
        html: getWeeklySummaryEmailHtml({
          totalCreated: total,
          totalCompleted: completed,
          activeCount: active,
        }),
      });

      // Mark as sent
      await ctx.runMutation(markNotificationSent, {
        notificationId,
      });

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
});
