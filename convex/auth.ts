import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { components } from "./_generated/api";
import { type DataModel } from "./_generated/dataModel";

/**
 * Better Auth Client for Convex
 *
 * This client is used throughout the Convex backend to:
 * - Get the authenticated user: authComponent.getAuthUser(ctx)
 * - Check authentication: authComponent.requireAuthUser(ctx)
 *
 * IMPORTANT: The returned user object has `_id` (Convex document ID) - use this
 * for rate limiting keys, database relations, etc.
 */
export const authComponent = createClient<DataModel>(components.betterAuth);

/**
 * Create Better Auth Instance
 *
 * This function creates a Better Auth instance configured for Convex.
 * It's called from HTTP handlers to process auth requests.
 *
 * @param ctx - Convex generic context
 * @param options - Configuration options
 * @returns Better Auth instance
 */
export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false }
) => {
  return betterAuth({
    // Base URL for auth redirects and callbacks
    baseURL: process.env.SITE_URL!,

    // Convex database adapter
    database: authComponent.adapter(ctx),

    // Enable email/password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Set to true in production
      // Optional: Add email verification in production
      // sendVerificationEmail: async (user, url) => {
      //   await resend.sendEmail(ctx, {
      //     to: user.email,
      //     subject: "Verify your email",
      //     html: `Click here to verify: ${url}`
      //   });
      // }
    },

    // Plugins
    plugins: [
      // Convex plugin for JWT-based sessions
      convex({
        jwtExpirationSeconds: 30 * 24 * 60 * 60, // 30 days
      }),

      // Note: Organization plugin is not included since this is a single-user app
      // Add if you need multi-tenant features:
      // organization({
      //   allowUserToCreateOrganization: true,
      //   organizationLimit: 1,
      //   membershipLimit: 100,
      // }),
    ],
  });
};
