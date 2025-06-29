# AGENTS.MD - Web App Context for sentiment-hound-v2

This document provides comprehensive context for AI agents working on the **web application** (`apps/web/`) within the sentiment-hound-v2 monorepo.

## 🏗️ Web App Architecture Overview

The web application is a **Next.js 15** application using the **App Router** with the following key characteristics:

- **Framework**: Next.js 15 with App Router
- **UI Library**: Mantine UI v8.0.2
- **Styling**: CSS Modules + Mantine components
- **Authentication**: NextAuth.js v5 (beta)
- **Database**: Prisma (via `@repo/db` workspace package)
- **Type Safety**: TypeScript with strict configuration
- **State Management**: Server Actions + React Server Components

## 📁 Directory Structure

```
apps/web/
├── actions/           # Server Actions for data mutations/fetching
├── app/              # Next.js App Router pages
│   ├── (landing-page)/  # Landing page routes (grouped)
│   ├── api/            # API routes
│   ├── dashboard/      # Protected dashboard routes
│   ├── pricing/        # Pricing page
│   ├── layout.tsx      # Root layout with Mantine provider
│   └── globals.css     # Global styles
├── components/        # React components (Atomic Design)
│   ├── atoms/         # Basic UI elements
│   ├── molecules/     # Component combinations
│   ├── organisms/     # Complex UI sections
│   └── templates/     # Page-level layouts
├── lib/              # Utility functions and configurations
├── public/           # Static assets
└── types/           # TypeScript type definitions
```

## 🔑 Key Reference Points

### 1. **Layout & Theming**

- **Root Layout**: `app/layout.tsx` - Sets up Mantine provider, global styles, and metadata
- **Theme Configuration**: `lib/theme.ts` - Mantine theme customization
- **Global Styles**: `app/globals.css` - CSS variables and global styling

### 2. **Authentication System**

- **NextAuth Configuration**: `lib/next-auth.lib.ts`
- **Auth Actions**: `actions/auth.actions.ts`
- **Adapter**: Uses Prisma adapter for database persistence
- **Provider**: Currently supports credential-based authentication

### 3. **Component Architecture (Atomic Design)**

- **Atoms**: Basic UI components (buttons, inputs, etc.)
- **Molecules**: Component combinations (cards, forms, etc.)
- **Organisms**: Complex sections (headers, footers, feature sections)
- **Templates**: Page layouts and structures

### 4. **Server Actions** (`actions/`)

- `auth.actions.ts` - Authentication operations
- `dashboard.actions.ts` - Dashboard data operations
- `early-access.actions.ts` - Early access system
- `integrations.actions.ts` - Third-party integrations
- `keywords.actions.ts` - Keyword management
- `navigation.actions.ts` - Navigation state
- `plan-usage.actions.ts` - Usage tracking
- `providers.actions.ts` - Content provider management
- `youtube.actions.ts` - YouTube integration

### 5. **Routing Structure**

- **(landing-page)** - Marketing pages (grouped route)
- **dashboard** - Protected user dashboard
- **api** - API endpoints
- **pricing** - Pricing and plans page

### 6. **Special Features**

- **Invitation Code System**: `components/InvitationCodeHandler.tsx` + `lib/invitation-code.utils.ts`
- **Early Access System**: Controlled via feature flags
- **Dashboard**: Multi-step onboarding and analytics interface

## 🎨 Design System

### UI Framework: Mantine v8.0.2

- **Components**: Uses Mantine's component library
- **Theming**: Custom theme in `lib/theme.ts`
- **Icons**: Tabler Icons React
- **Charts**: Mantine Charts + Recharts

### Styling Approach

- **CSS Modules**: Component-specific styles (`.module.css`)
- **Mantine Classes**: Utility classes and component styling
- **Custom Properties**: CSS variables for consistent theming

### Color Palette

- **Primary**: Custom red/orange gradient (#ef4444 to #dc2626)
- **Background**: Dark theme with gradients
- **Accent**: Blue (#3B82F6), Green (#10B981), Purple (#8B5CF6)

## 🔌 Integration Points

### Database

- **ORM**: Prisma via `@repo/db` workspace package
- **Client**: Pre-configured Prisma client
- **Schemas**: User, Plans, Integrations, Analytics data

### Services Layer

- **Package**: `@repo/services` workspace package
- **Purpose**: Shared business logic between web app and server
- **Usage**: Imported in Server Actions and API routes

### External Services

- **YouTube API**: Video/channel analytics integration
- **Reddit API**: Subreddit sentiment analysis
- **Sentiment Analysis**: Internal Python service communication

## 🛠️ Development Guidelines

### File Naming Conventions

- **Components**: PascalCase with `.tsx` extension
- **Styles**: Component name + `.module.css`
- **Actions**: kebab-case + `.actions.ts`
- **Utils**: kebab-case + `.utils.ts`

### Component Structure

```tsx
// Standard component pattern
import { ComponentProps } from "@mantine/core";
import classes from "./ComponentName.module.css";

interface ComponentNameProps {
  // Props definition
}

const ComponentName = ({ ...props }: ComponentNameProps) => {
  return <div className={classes.wrapper}>{/* Component JSX */}</div>;
};

export default ComponentName;
```

### Server Actions Pattern

```tsx
"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/next-auth.lib";

export async function actionName(formData: FormData) {
  const session = await auth();
  if (!session) redirect("/auth/signin");

  // Action logic
}
```

## 🚀 Build & Development

### Scripts

- `pnpm dev` - Development server with Turbopack
- `pnpm build` - Production build
- `pnpm lint` - ESLint with max 0 warnings
- `pnpm check-types` - TypeScript type checking

### Environment Variables

- Authentication secrets (NextAuth)
- Database connection strings
- API keys for integrations
- Feature flag configurations

## 📱 Responsive Design

### Breakpoints (Mantine)

- **xs**: 576px
- **sm**: 768px
- **md**: 992px
- **lg**: 1200px
- **xl**: 1400px

### Mobile-First Approach

- Components use responsive Mantine props
- CSS modules include media queries
- Touch-friendly interface elements

## 🔒 Security Considerations

- **Authentication**: Session-based with NextAuth.js
- **Authorization**: Route protection via middleware
- **CSRF Protection**: Built into Server Actions
- **Input Validation**: Zod schemas for form validation
- **Environment**: Secure environment variable handling

## 🎯 Key User Flows

1. **Landing → Early Access Signup** (if feature flagged)
2. **Landing → Authentication → Dashboard Onboarding**
3. **Dashboard → Integration Setup → Analytics View**
4. **Settings → Plan Management → Usage Monitoring**

---

**Note**: This web app is part of a larger monorepo. Always consider the integration points with `apps/server/`, `apps/sentiment-analysis-service/`, and shared packages when making changes.
