# Frontend Architecture Overview

## Purpose of This Document

This document provides a comprehensive overview of the Next.js web application architecture, including routing strategies, data flow patterns, and component organization for the sentiment analysis platform.

## Application Structure

### App Router Foundation

The application uses **Next.js 15 App Router** with file-based routing and strategic route groups:

- **Public Routes**: Landing pages, authentication, and marketing content
- **Protected Routes**: Dashboard features requiring authentication via NextAuth.js
- **Route Groups**: `(landing-page)`, `(overview)` for logical organization without URL segments

### Core Architecture Patterns

#### Server Actions as Primary Data Layer

The application **heavily favors Server Actions** over traditional API routes for all data mutations:

- **Location**: `actions/` directory with domain-specific action files
- **Pattern**: All actions use `"use server"` directive and return `ActionResponse<T>`
- **Authentication**: Integrated with `auth()` helper for session validation
- **Key Files**:
  - `analysis.actions.ts` - Core sentiment analysis workflows  
  - `auth.actions.ts` - Authentication & user management
  - `integrations.actions.ts` - Social media platform connections
  - `dashboard.actions.ts` - Dashboard data aggregation
  - `account.actions.ts` - Account management and user operations

#### Component Architecture (Atomic Design)

Components follow atomic design principles for maintainability:

- **`atoms/`**: Basic UI elements (buttons, inputs, typography)
- **`molecules/`**: Simple compound components (cards, forms)
- **`organisms/`**: Complex feature components (navigation, layouts)
- **`templates/`**: Page-level layout components
- **`layout/`**: App-wide structural components

## Data Flow & State Management

### Primary Data Flow

1. **UI Components** trigger **Server Actions** 
2. **Server Actions** call **Services** from `@repo/services`
3. **Services** use **Prisma** from `@repo/db`
4. Response flows back through the chain with type safety

### State Management Strategy

- **Server State**: Managed via Server Actions and React Server Components
- **Client State**: Mantine hooks (`useForm`, `useDisclosure`) for UI interactions
- **Global State**: Zustand slices for complex client-side state when needed
- **Notifications**: Mantine notifications system for user feedback

## Authentication & Security

### NextAuth.js Integration

- **Version**: NextAuth.js v5 (beta) with hybrid authentication support
- **Providers**: Google OAuth 2.0 and credentials-based authentication
- **Session Strategy**: JWT sessions with Prisma adapter for persistence
- **Protection Pattern**: Dashboard layout checks `session?.user?.id` and redirects

### Route Protection

- **Layout-Level**: `/dashboard/layout.tsx` handles authentication checks
- **Server Actions**: Use `auth()` helper for session validation
- **Graceful Handling**: Automatic redirect to sign-in for unauthenticated users

## User Experience & Interface

### Dashboard Layout System

- **Responsive Design**: Mobile-first with breakpoint-based navigation
- **Sidebar Navigation**: Collapsible with active state indicators
- **Layout Props**: Flexible layout system supporting custom headers, sidebars, and error states
- **Loading States**: Skeleton loading components for better perceived performance

### Error Handling & Feedback

- **Error Boundaries**: Integrated error state handling in layout components
- **User Feedback**: Toast notifications for action results
- **Loading States**: Skeleton components and loading indicators
- **Graceful Degradation**: Fallback states for failed operations

## Integration with Monorepo

### Shared Dependencies

- **Database**: Single Prisma client from `@repo/db`
- **Services**: Business logic from `@repo/services` 
- **Types**: Shared TypeScript definitions across packages
- **Configuration**: Unified ESLint, TypeScript, and tooling configuration

### Cross-Application Communication

- **Queue System**: Primary integration with NestJS server via database queues
- **Shared Services**: Business logic abstracted for reuse across applications
- **Type Safety**: Full TypeScript support with shared type definitions

## Modern Next.js Features

### Server Components & Actions

- **Default**: Server Components for data fetching and initial renders
- **Client Components**: Only when interactive features are required (`"use client"`)
- **Streaming**: Suspense boundaries for progressive loading
- **Caching**: Automatic caching with `revalidatePath` for cache invalidation

### Performance Optimizations

- **Bundle Optimization**: Tree shaking and code splitting
- **Image Optimization**: Next.js Image component with automatic optimization
- **Font Optimization**: Local font files with Next.js font optimization
- **Static Generation**: Where appropriate for marketing pages

## Development Patterns

### Form Handling

- **Server Actions**: Preferred for form submissions over client-side API calls
- **Mantine Integration**: `useForm` hook for client-side validation
- **Type Safety**: Zod schemas for validation when needed
- **Progressive Enhancement**: Forms work without JavaScript

### Error Handling Strategy

- **Server Actions**: Consistent error response patterns with `ActionResponse<T>`
- **Client Components**: Error boundaries and try-catch patterns
- **User Experience**: Meaningful error messages and recovery actions
- **Monitoring**: Console logging for development debugging

### Styling & Theming

- **UI Library**: Mantine v7 for consistent design system
- **CSS Modules**: Component-scoped styling for custom components
- **Theme System**: Centralized theme configuration with CSS custom properties
- **Responsive Design**: Mobile-first approach with Mantine's responsive utilities
