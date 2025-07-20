# Important Files

## Purpose of This Document
This document highlights the most critical files in the web application that are essential for understanding the system architecture and making effective changes.

## Core Configuration Files

### Application Configuration
- `package.json`: Dependencies, scripts, and workspace configuration
- `next.config.js`: Next.js configuration including build settings and optimizations
- `tsconfig.json`: TypeScript configuration with strict type checking
- `postcss.config.cjs`: Mantine UI styling and PostCSS configuration

### Authentication & Security
- `lib/next-auth.lib.ts`: NextAuth.js configuration with providers and session strategy
- `app/api/auth/[...nextauth]/route.ts`: Authentication API route handler

## Business Logic Entry Points

### Server Actions (Primary Data Layer)
- `actions/auth.actions.ts`: Authentication operations (sign-in, sign-up)
- `actions/dashboard.actions.ts`: Core dashboard data fetching and analytics
- `actions/plan-usage.actions.ts`: User plan and feature usage tracking
- `slices/tasks/tasks.actions.ts`: Background job management and monitoring

### Key Service Integrations
- Integration with `@repo/services` for all business logic
- Direct Prisma database access through `@repo/db`
- External API calls handled through service layer

## User Interface Structure

### Layout System
- `app/layout.tsx`: Root layout with global providers and styling
- `app/dashboard/layout.tsx`: Protected dashboard layout with navigation
- `components/`: Atomic design structure (atoms, molecules, organisms)

### Critical Pages
- `app/(landing-page)/page.tsx`: Marketing landing page
- `app/dashboard/(overview)/page.tsx`: Main dashboard overview
- `app/dashboard/integrations/page.tsx`: Social media platform connections
- `app/dashboard/posts/page.tsx`: Content management and analysis

## Development & Testing

### Build System
- `turbo.json`: Monorepo build configuration and task dependencies
- `pnpm-workspace.yaml`: Package manager workspace configuration
- `vitest.config.ts`: Test configuration and setup

### Code Quality
- `eslint.config.js`: Code linting rules and standards
- `prettier.config.js`: Code formatting configuration

## Type Definitions
- `types/`: Shared TypeScript type definitions
- Database types auto-generated from Prisma schema
- NextAuth.js type extensions for custom user properties

## Styling & Assets
- `app/globals.css`: Global styles and CSS variables
- `public/`: Static assets including images and icons
- Mantine UI theme configuration integrated into layouts

## Key Integration Points
- `@repo/services`: Shared business logic package
- `@repo/db`: Database access and Prisma client
- External sentiment analysis service API
- Social media platform APIs (Reddit, YouTube)

## Environment Configuration
- `.env.local`: Local development environment variables
- Database connection strings and API keys
- OAuth client IDs and secrets for authentication
