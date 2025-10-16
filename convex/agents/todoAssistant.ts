import { Agent } from "@convex-dev/agent";
import { internal } from "../_generated/api";
import { v } from "convex/values";

/**
 * Todo Assistant Agent
 *
 * An AI assistant specialized in helping users manage their todos.
 * Features multi-step reasoning and can perform CRUD operations.
 */
export const todoAssistant = new Agent({
  name: "Todo Assistant",
  description: "Helps users manage and organize their todos",

  tools: [
    {
      name: "list_todos",
      description: "Get all user's todos",
      parameters: {
        userId: v.id("users"),
        limit: v.optional(v.number())
      },
      handler: async (ctx, { userId, limit = 20 }) => {
        const items = await ctx.db
          .query("todos")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .take(limit);

        return items;
      }
    },
    {
      name: "create_todo",
      description: "Create a new todo",
      parameters: {
        userId: v.id("users"),
        userId: v.string, text: v.string, completed: v.boolean
      },
      handler: async (ctx, args) => {
        const id = await ctx.db.insert("todos", {
          userId: args.userId,
          userId: args.userId, text: args.text, completed: args.completed,
          createdAt: Date.now()
        });

        return { id, success: true };
      }
    },
    {
      name: "analyze_todos",
      description: "Analyze user's todos and provide insights",
      parameters: {
        userId: v.id("users")
      },
      handler: async (ctx, { userId }) => {
        const items = await ctx.db
          .query("todos")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .collect();

        const total = items.length;
        const recent = items.filter(item =>
          item.createdAt > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length;

        return {
          total,
          recentCount: recent,
          insights: {
            activity: recent > 0 ? "active" : "inactive",
            recommendation: total === 0
              ? "Get started by creating your first todo"
              : `You have ${total} todos total`
          }
        };
      }
    }
  ],

  systemPrompt: `You are a helpful todo management assistant.

You help users with their todos by:
1. Listing and searching todos
2. Creating new todos
3. Analyzing patterns and providing insights
4. Making recommendations for better organization

When responding:
- Be proactive and suggest actions
- Provide context and reasoning
- Keep responses concise but informative
- Use the tools available to fetch real data

If a user asks about their todos, always check the current state first using list_todos.`,
});
