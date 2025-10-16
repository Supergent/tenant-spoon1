/**
 * Better Auth Client Configuration
 *
 * Client-side authentication setup for the browser.
 * Used in React components for sign in, sign up, sign out, etc.
 */

import { createAuthClient } from "better-auth/react";
import { convexClient } from "@convex-dev/better-auth/react/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  plugins: [convexClient()],
});

/**
 * Export hooks for easy access
 */
export const {
  useSession,
  signIn,
  signUp,
  signOut,
  resetPassword,
  updateUser,
} = authClient;
