import { RateLimiter, MINUTE, HOUR } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

/**
 * Rate Limiter Configuration
 *
 * Protects API endpoints from abuse with token bucket rate limiting.
 * Uses user._id as the key for per-user limits.
 */
export const rateLimiter = new RateLimiter(components.rateLimiter, {
  // =========================================================================
  // TODO OPERATIONS
  // =========================================================================

  // Create todo: 20 per minute with burst capacity
  createTodo: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },

  // Update todo: 50 per minute
  updateTodo: {
    kind: "token bucket",
    rate: 50,
    period: MINUTE,
    capacity: 10,
  },

  // Delete todo: 30 per minute
  deleteTodo: {
    kind: "token bucket",
    rate: 30,
    period: MINUTE,
    capacity: 5,
  },

  // =========================================================================
  // AI AGENT OPERATIONS
  // =========================================================================

  // Send message: 10 per minute (AI operations are expensive)
  sendMessage: {
    kind: "token bucket",
    rate: 10,
    period: MINUTE,
    capacity: 2,
  },

  // Create thread: 5 per minute
  createThread: {
    kind: "token bucket",
    rate: 5,
    period: MINUTE,
    capacity: 2,
  },

  // =========================================================================
  // EMAIL OPERATIONS
  // =========================================================================

  // Send email: 10 per hour (prevent email spam)
  sendEmail: {
    kind: "fixed window",
    rate: 10,
    period: HOUR,
  },

  // =========================================================================
  // PREFERENCE UPDATES
  // =========================================================================

  // Update preferences: 20 per minute
  updatePreferences: {
    kind: "token bucket",
    rate: 20,
    period: MINUTE,
    capacity: 5,
  },
});
