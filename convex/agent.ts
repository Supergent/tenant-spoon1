import { Agent } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { AGENT_CONFIG } from "./helpers/constants";

/**
 * AI Agent Configuration
 *
 * Provides an intelligent assistant to help users manage their todos.
 * The agent can:
 * - Answer questions about tasks
 * - Provide productivity suggestions
 * - Help prioritize todos
 * - Offer task management tips
 */

// Determine which AI provider to use based on environment variables
const getLanguageModel = () => {
  if (process.env.OPENAI_API_KEY) {
    // Use OpenAI if available
    const { openai } = require("@ai-sdk/openai");
    return openai.chat(AGENT_CONFIG.MODEL);
  } else if (process.env.ANTHROPIC_API_KEY) {
    // Fall back to Anthropic
    const { anthropic } = require("@ai-sdk/anthropic");
    return anthropic("claude-3-5-sonnet-20241022");
  }

  throw new Error(
    "No AI provider configured. Please set OPENAI_API_KEY or ANTHROPIC_API_KEY."
  );
};

export const assistant = new Agent(components.agent, {
  name: "Todo Assistant",
  languageModel: getLanguageModel(),
  instructions: AGENT_CONFIG.SYSTEM_PROMPT,
});
