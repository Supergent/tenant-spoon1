import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createAuth } from "./auth";

/**
 * HTTP Router for Convex
 *
 * Handles HTTP requests including Better Auth endpoints.
 * Better Auth requires both GET and POST routes at /auth/*
 */
const http = httpRouter();

/**
 * Better Auth POST Routes
 * Handles authentication requests:
 * - /auth/sign-in
 * - /auth/sign-up
 * - /auth/sign-out
 * - /auth/session
 */
http.route({
  path: "/auth/*",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

/**
 * Better Auth GET Routes
 * Handles authentication requests:
 * - /auth/session (check session)
 * - /auth/callback/* (OAuth callbacks if added later)
 */
http.route({
  path: "/auth/*",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const auth = createAuth(ctx);
    return await auth.handler(request);
  }),
});

export default http;
