# Distraction-Free Todos

A minimalist, real-time todo list application that keeps you focused on what matters. Built with Convex for instant synchronization across all your devices.

## ✨ Features

- **Real-time Sync**: Changes appear instantly across all devices
- **Distraction-Free**: Clean, minimal interface with no clutter
- **Secure Authentication**: Email/password authentication via Better Auth
- **AI Assistant**: Get intelligent task suggestions and organization help
- **Email Notifications**: Optional reminders and weekly summaries
- **Private by Default**: Each user has their own isolated todo list

## 🏗️ Architecture

This project follows the **Cleargent Four-Layer Architecture Pattern**:

```
convex/
├── db/              # Database layer - Pure CRUD operations
├── endpoints/       # Endpoint layer - Business logic & API
├── workflows/       # Workflow layer - Durable external services
└── helpers/         # Helper layer - Pure utility functions
```

### Components Used

- **Better Auth** (`@convex-dev/better-auth`) - Authentication & session management
- **Rate Limiter** (`@convex-dev/rate-limiter`) - API rate limiting to prevent abuse
- **Agent** (`@convex-dev/agent`) - AI agent for intelligent task assistance
- **Resend** (`@convex-dev/resend`) - Transactional email notifications

## 📋 Prerequisites

- Node.js 18+ and pnpm 9+
- Convex account (sign up at [convex.dev](https://convex.dev))
- Resend account for email notifications (optional)
- OpenAI or Anthropic API key for AI features (optional)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Convex

```bash
# Install Convex CLI globally (if not already installed)
npm install -g convex

# Login to Convex
npx convex login

# Initialize your Convex deployment
npx convex dev
```

This will create a new Convex deployment and automatically populate `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.

### 3. Install Convex Components

The required Convex components need to be installed in your deployment:

```bash
npx convex components install @convex-dev/better-auth --save
npx convex components install @convex-dev/rate-limiter --save
npx convex components install @convex-dev/agent --save
npx convex components install @convex-dev/resend --save
```

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in the required values:

```bash
# Generate Better Auth secret
openssl rand -base64 32

# Add to .env.local
BETTER_AUTH_SECRET=<generated-secret>
SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Optional services:**

- **Resend** (for email notifications): Get API key from [resend.com](https://resend.com)
- **OpenAI** (for AI assistant): Get API key from [platform.openai.com](https://platform.openai.com)
- **Anthropic** (alternative AI provider): Get API key from [console.anthropic.com](https://console.anthropic.com)

### 5. Start Development Server

```bash
pnpm dev
```

This will start both:
- Convex backend (watching for changes)
- Next.js frontend at [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
distraction-free-todos/
├── apps/
│   └── web/              # Next.js frontend application
│       ├── app/          # App router pages
│       ├── components/   # React components
│       ├── lib/          # Utilities and auth setup
│       └── providers/    # React context providers
├── convex/
│   ├── schema.ts         # Database schema definition
│   ├── convex.config.ts  # Convex components configuration
│   ├── auth.ts           # Better Auth setup
│   ├── http.ts           # HTTP routes (auth endpoints)
│   ├── db/               # Database layer (Phase 2)
│   ├── endpoints/        # API endpoints (Phase 2)
│   └── helpers/          # Utility functions (Phase 2)
├── packages/             # Shared packages (optional)
└── package.json          # Monorepo root
```

## 🗄️ Database Schema

### Core Tables

- **todos**: User's todo items with text, completion status, and optional metadata
- **threads**: AI assistant conversation threads
- **messages**: Chat messages between user and AI assistant
- **emailNotifications**: Email notification history and status
- **userPreferences**: User settings for notifications, theme, and AI features

All tables are user-scoped with proper indexes for efficient queries.

## 🔐 Authentication

Authentication is handled by Better Auth with the Convex plugin:

- **Email/Password**: Built-in authentication with secure password hashing
- **Sessions**: JWT-based sessions with 30-day expiration
- **User Isolation**: All data is scoped to the authenticated user

## 🛡️ Rate Limiting

API endpoints are protected with rate limiting:

- **Token bucket algorithm**: Allows bursts with smooth refill
- **Per-user limits**: Rate limits are applied per authenticated user
- **Configurable**: Easy to adjust limits in `convex/rateLimiter.ts` (Phase 2)

## 📧 Email Notifications (Optional)

If configured, the app can send:

- Welcome emails on signup
- Todo reminders at your preferred time
- Weekly summaries of completed tasks

Configure email settings in user preferences after signing up.

## 🤖 AI Assistant (Optional)

The AI agent can help you:

- Organize and prioritize tasks
- Break down large tasks into smaller steps
- Suggest task categories and tags
- Provide productivity insights

Enable AI assistance in user preferences and start a conversation.

## 🎨 Design System

Uses the project's custom theme with:

- **Primary**: Indigo (#6366f1)
- **Secondary**: Sky blue (#0ea5e9)
- **Accent**: Orange (#f97316)
- **Font**: Inter with system fallbacks
- **Components**: Radix UI primitives + shadcn/ui styling

## 🧪 Development Commands

```bash
# Start development servers
pnpm dev

# Start only frontend
pnpm web:dev

# Start only Convex backend
pnpm convex:dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
```

## 🚢 Deployment

### Deploy Convex Backend

```bash
# Create production deployment
npx convex deploy

# This will give you production URLs to use in your .env.production
```

### Deploy Next.js Frontend

Deploy to Vercel, Netlify, or any Next.js-compatible host:

1. Set environment variables in your hosting platform
2. Update `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to your production domain
3. Deploy the `apps/web` directory

## 📚 Next Steps

**Phase 2** will implement:

1. Database layer (`convex/db/`) - CRUD operations for todos, users, preferences
2. Endpoint layer (`convex/endpoints/`) - Business logic and API routes
3. Helper layer (`convex/helpers/`) - Validation and utility functions
4. Frontend components (`apps/web/`) - React UI with real-time updates
5. Authentication providers - Client and server-side auth setup

## 🤝 Contributing

This project follows strict architectural patterns. Please review `CONVEX_BOOTSTRAP_PATTERNS.md` before contributing.

## 📄 License

MIT License - feel free to use this project as a starting point for your own applications.

## 🆘 Support

- Convex Documentation: https://docs.convex.dev
- Better Auth Documentation: https://better-auth.com
- Issues: Open an issue in this repository

---

Built with ❤️ using Convex, Next.js, and modern web technologies.
