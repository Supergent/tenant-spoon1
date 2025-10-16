import { Resend } from "@convex-dev/resend";
import { components } from "./_generated/api";

/**
 * Resend Email Configuration
 *
 * Handles transactional emails for:
 * - Welcome emails
 * - Todo reminders
 * - Weekly summaries
 */
export const resend: Resend = new Resend(components.resend, {});

/**
 * Email template utilities
 */

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@example.com";
export const FROM_NAME =
  process.env.RESEND_FROM_NAME || "Distraction-Free Todos";

/**
 * Generate welcome email HTML
 */
export function getWelcomeEmailHtml(userName?: string): string {
  const greeting = userName ? `Hi ${userName}` : "Hello";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px; }
          .content { background: #ffffff; padding: 30px; margin-top: 20px; border-radius: 8px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; color: #475569; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Distraction-Free Todos!</h1>
          </div>
          <div class="content">
            <p>${greeting},</p>
            <p>Thanks for joining Distraction-Free Todos! We're excited to help you stay organized and productive.</p>
            <p>Here's what you can do:</p>
            <ul>
              <li>✅ Create and manage your personal todo list</li>
              <li>🔄 Sync your todos across all your devices in real-time</li>
              <li>🤖 Get help from our AI assistant</li>
              <li>📧 Receive helpful reminders and weekly summaries</li>
            </ul>
            <p>Your todos are private and secure. Only you can see them.</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>You're receiving this email because you signed up for Distraction-Free Todos.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate todo reminder email HTML
 */
export function getTodoReminderEmailHtml(
  activeTodoCount: number,
  todos: Array<{ text: string; priority?: string }>
): string {
  const todoList = todos
    .slice(0, 5) // Show max 5 todos
    .map(
      (todo) => `
      <li style="margin: 10px 0;">
        ${todo.priority === "high" ? "🔴" : todo.priority === "medium" ? "🟡" : ""}
        ${todo.text}
      </li>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #ffffff; padding: 30px; border-radius: 8px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>📋 You have ${activeTodoCount} active todo${activeTodoCount !== 1 ? "s" : ""}</h2>
            <p>Here are your pending tasks:</p>
            <ul>${todoList}</ul>
            ${activeTodoCount > 5 ? `<p><em>And ${activeTodoCount - 5} more...</em></p>` : ""}
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">View All Todos</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Generate weekly summary email HTML
 */
export function getWeeklySummaryEmailHtml(stats: {
  totalCreated: number;
  totalCompleted: number;
  activeCount: number;
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; color: #0f172a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .content { background: #ffffff; padding: 30px; border-radius: 8px; }
          .stat { display: inline-block; margin: 20px; text-align: center; }
          .stat-value { font-size: 36px; font-weight: bold; color: #6366f1; }
          .stat-label { color: #475569; font-size: 14px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2>📊 Your Weekly Todo Summary</h2>
            <p>Here's what you accomplished this week:</p>
            <div style="text-align: center;">
              <div class="stat">
                <div class="stat-value">${stats.totalCreated}</div>
                <div class="stat-label">Created</div>
              </div>
              <div class="stat">
                <div class="stat-value">${stats.totalCompleted}</div>
                <div class="stat-label">Completed</div>
              </div>
              <div class="stat">
                <div class="stat-value">${stats.activeCount}</div>
                <div class="stat-label">Active</div>
              </div>
            </div>
            <p>Keep up the great work! 🎉</p>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL}" class="button">View Your Todos</a>
          </div>
        </div>
      </body>
    </html>
  `;
}
