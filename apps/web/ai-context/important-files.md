# Important Files Reference

## Core Configuration
- `next.config.js` - Next.js configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Test configuration

## Authentication & Layout
- `app/layout.tsx` - Root layout with providers
- `lib/next-auth.lib.ts` - NextAuth configuration
- `lib/mantine.provider.tsx` - UI theme setup

## Key Server Actions
- `actions/analysis.actions.ts` - **Core feature**: Post analysis workflows
- `actions/integrations.actions.ts` - Social media OAuth flows
- `actions/dashboard.actions.ts` - Dashboard data aggregation
- `actions/auth.actions.ts` - User management
- `actions/plan-usage.actions.ts` - Subscription limits

## Main Pages
- `app/dashboard/analyse/page.tsx` - **Primary feature**: Analysis form
- `app/dashboard/(overview)/page.tsx` - Dashboard home
- `app/dashboard/posts/page.tsx` - Analysis results
- `app/dashboard/integrations/page.tsx` - Platform connections

## Critical Components
- `components/organisms/AnalyseForm/` - Main analysis interface
- `components/organisms/DashboardStats/` - Key metrics display
- `components/layout/` - Navigation and shell components

## Type Definitions
- `lib/types.ts` - API response types and interfaces
- `types/` - Feature-specific type definitions

## Utilities
- `lib/` - Shared utilities and configurations
- `hooks/` - Custom React hooks
- `slices/` - State management (if using Redux/Zustand)

## Testing
- `vitest.setup.ts` - Test configuration
- `*.test.ts` - Component and action tests
- `actions/*.smoke.test.ts` - Integration smoke tests
