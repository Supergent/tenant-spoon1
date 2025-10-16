# Quick Start Guide

Get your Distraction-Free Todo List app running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A terminal/command prompt

## Step 1: Install Dependencies

```bash
pnpm install
```

This installs all dependencies for the monorepo including Convex, Next.js, and component packages.

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Generate an auth secret:
   ```bash
   openssl rand -base64 32
   ```

3. Edit `.env.local` and add the generated secret to `BETTER_AUTH_SECRET`

4. The file should look like:
   ```bash
   # Convex - Leave empty for now
   CONVEX_DEPLOYMENT=
   NEXT_PUBLIC_CONVEX_URL=

   # Better Auth - Add your generated secret here
   BETTER_AUTH_SECRET=your-generated-secret-here
   SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Resend - Optional (for email features)
   RESEND_API_KEY=
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   RESEND_FROM_NAME="Distraction-Free Todos"

   # AI - Optional (for AI assistant features)
   OPENAI_API_KEY=
   ANTHROPIC_API_KEY=
   ```

## Step 3: Start Convex Development Server

In one terminal, start Convex:

```bash
npx convex dev
```

This will:
- Create a new Convex deployment
- Automatically fill in `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in `.env.local`
- Watch for changes and sync your schema

**Important**: Keep this terminal running!

## Step 4: Start Next.js Development Server

In a **separate terminal**, start the Next.js app:

```bash
pnpm web:dev
```

Or use the combined command (requires `concurrently`):

```bash
pnpm dev
```

## Step 5: Open the App

Visit [http://localhost:3000](http://localhost:3000)

You should see the authentication screen!

## Step 6: Create Your First Account

1. Click "Don't have an account? Sign up"
2. Enter your email and password
3. Click "Sign Up"
4. You'll be redirected to your todo list!

## Step 7: Create Your First Todo

1. Type "Buy groceries" in the input field
2. Click "Add"
3. Your todo appears instantly! ✨

## Step 8: Test Real-time Sync

1. Open [http://localhost:3000](http://localhost:3000) in **two different browser tabs**
2. Create a todo in one tab
3. Watch it appear instantly in the other tab! 🚀

---

## Common Issues

### "NEXT_PUBLIC_CONVEX_URL is not set"

**Solution**: Make sure `npx convex dev` is running. It automatically fills this variable.

### "Not authenticated" errors

**Solution**:
1. Check that `BETTER_AUTH_SECRET` is set in `.env.local`
2. Try signing out and signing back in
3. Clear browser cookies for `localhost:3000`

### Import errors for `@jn74zky3xx5yj89rx9nes87swx7skt7x/components`

**Solution**: Run `pnpm install` from the root directory to ensure workspace packages are linked.

### Tailwind classes not working

**Solution**:
1. Check that `apps/web/tailwind.config.ts` imports from `@jn74zky3xx5yj89rx9nes87swx7skt7x/design-tokens`
2. Restart the Next.js dev server

---

## What's Next?

Now that your app is running, you can:

1. ✅ **Create todos** - Add tasks to your list
2. ✅ **Toggle completion** - Click the checkbox to mark done
3. ✅ **Filter todos** - Use All/Active/Completed filters
4. ✅ **Delete todos** - Hover over a todo and click the trash icon
5. ✅ **Clear completed** - Clean up your list

### Optional: Enable AI Assistant

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Add it to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-...
   ```
3. Restart the Convex dev server (`npx convex dev`)
4. The AI assistant will be available in your app!

### Optional: Enable Email Notifications

1. Get a Resend API key from [resend.com](https://resend.com)
2. Add it to `.env.local`:
   ```bash
   RESEND_API_KEY=re_...
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   ```
3. Restart the Convex dev server
4. Welcome emails will be sent on signup!

---

## Development Commands

```bash
# Start both Convex and Next.js together
pnpm dev

# Start Convex only
npx convex dev

# Start Next.js only
pnpm web:dev

# Build for production
pnpm build

# Run Storybook (component playground)
pnpm storybook

# Type checking
pnpm type-check
```

---

## Project Structure

```
.
├── convex/              # Backend (Convex)
│   ├── db/              # Database layer (CRUD operations)
│   ├── endpoints/       # API endpoints (business logic)
│   ├── helpers/         # Utilities
│   └── schema.ts        # Database schema
│
├── apps/web/            # Frontend (Next.js)
│   ├── app/             # App router pages
│   ├── components/      # React components
│   └── lib/             # Client utilities
│
└── packages/            # Shared packages
    ├── components/      # UI components
    └── design-tokens/   # Theme configuration
```

---

## Helpful Resources

- 📚 [Full Implementation Guide](./IMPLEMENTATION.md)
- 📖 [Convex Documentation](https://docs.convex.dev)
- 🔐 [Better Auth Documentation](https://better-auth.com)
- 🎨 [shadcn/ui Components](https://ui.shadcn.com)

---

**Happy coding! 🎉**

If you run into any issues, check the [Implementation Guide](./IMPLEMENTATION.md) for detailed troubleshooting.
