import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import agent from "@convex-dev/agent/convex.config";
import resend from "@convex-dev/resend/convex.config";

const app = defineApp();

// Better Auth MUST be first
app.use(betterAuth);

// Rate limiting for production API protection
app.use(rateLimiter);

// AI agent for intelligent task assistance
app.use(agent);

// Email notifications and transactional emails
app.use(resend);

export default app;
