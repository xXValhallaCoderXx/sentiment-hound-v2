# Web App Architecture Overview

## Tech Stack
- **Next.js 15** with App Router (SSR/SSG)
- **TypeScript** for type safety
- **Mantine UI** for components
- **NextAuth.js** for authentication
- **Vitest** for testing

## Core Structure

### App Router (`app/`)
- **Layout**: `app/layout.tsx` - Root layout with providers
- **Dashboard**: `app/dashboard/` - Protected routes requiring auth
- **Public Pages**: `app/(landing-page)/`, `app/pricing/`, etc.
- **API Routes**: `app/api/` - Traditional API endpoints (minimal use)

### Server Actions (`actions/`)
**Primary data layer** - Replaces traditional API routes:
- `analysis.actions.ts` - Core sentiment analysis workflows
- `auth.actions.ts` - Authentication & user management
- `integrations.actions.ts` - Social media platform connections
- `dashboard.actions.ts` - Dashboard data aggregation
- All actions use `"use server"` directive and return `ActionResponse<T>`

### Components (`components/`)
**Atomic Design Pattern**:
- `atoms/` - Basic UI elements (buttons, inputs)
- `molecules/` - Simple compound components
- `organisms/` - Complex feature components
- `layout/` - App-wide layout components

### Key Libraries (`lib/`)
- `next-auth.lib.ts` - Authentication configuration
- `types.ts` - Shared TypeScript interfaces
- `mantine.provider.tsx` - UI theme provider

## Data Flow
1. **UI Components** trigger **Server Actions**
2. **Server Actions** call **Services** from `@repo/services`
3. **Services** use **Prisma** from `@repo/db`
4. Response flows back through the chain

## Authentication
- NextAuth.js with multiple OAuth providers
- Session management in server actions via `auth()`
- Protected routes check `session?.user?.id`
