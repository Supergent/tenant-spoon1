/**
 * Application Constants
 *
 * Shared constants used throughout the application.
 */

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
} as const;

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMITS = {
  // Mutations
  CREATE_TODO: { rate: 20, period: 60_000 }, // 20 per minute
  UPDATE_TODO: { rate: 50, period: 60_000 }, // 50 per minute
  DELETE_TODO: { rate: 30, period: 60_000 }, // 30 per minute

  // AI Agent
  SEND_MESSAGE: { rate: 10, period: 60_000 }, // 10 per minute
  CREATE_THREAD: { rate: 5, period: 60_000 }, // 5 per minute

  // Email
  SEND_EMAIL: { rate: 10, period: 3600_000 }, // 10 per hour
} as const;

// ============================================================================
// EMAIL TEMPLATES
// ============================================================================

export const EMAIL_SUBJECTS = {
  WELCOME: "Welcome to Distraction-Free Todos!",
  TODO_REMINDER: "You have pending todos",
  WEEKLY_SUMMARY: "Your weekly todo summary",
} as const;

// ============================================================================
// AI AGENT
// ============================================================================

export const AGENT_CONFIG = {
  MODEL: "gpt-4o-mini",
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.7,
  SYSTEM_PROMPT: `You are a helpful AI assistant for a distraction-free todo list application.
You help users manage their tasks, provide suggestions, and answer questions about their todos.
Keep your responses concise and actionable. Focus on helping users stay productive and organized.`,
} as const;

// ============================================================================
// USER PREFERENCES
// ============================================================================

export const DEFAULT_PREFERENCES = {
  emailNotificationsEnabled: true,
  theme: "system" as const,
  defaultView: "all" as const,
  aiAssistantEnabled: true,
} as const;

// ============================================================================
// TODO SETTINGS
// ============================================================================

export const TODO_SETTINGS = {
  MAX_TEXT_LENGTH: 500,
  MAX_TAGS: 10,
  MAX_TAG_LENGTH: 30,
} as const;

// ============================================================================
// THREAD SETTINGS
// ============================================================================

export const THREAD_SETTINGS = {
  MAX_TITLE_LENGTH: 200,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_MESSAGES_PER_THREAD: 100,
} as const;
