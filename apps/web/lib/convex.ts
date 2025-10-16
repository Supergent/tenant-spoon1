/**
 * Convex Client Configuration
 *
 * Creates the Convex React client for real-time data synchronization.
 */

import { ConvexReactClient } from "convex/react";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL is not set. Please add it to your .env.local file."
  );
}

export const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL
);
