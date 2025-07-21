# Frontend Routing & Navigation

## Purpose of This Document

This document outlines the specific URL structure and navigation patterns used in the Next.js web application, complementing the architectural overview.

## Route Structure

### Public Routes

**Marketing & Authentication**
- `/` - Landing page with hero section, features showcase, and early access signup
- `/sign-in` - User authentication with Google OAuth and email/password options  
- `/sign-up` - User registration form with validation
- `/pricing` - Subscription plans and pricing information
- `/features` - Detailed feature showcase and product benefits
- `/changelog` - Product updates, version history, and release notes

### Protected Dashboard Routes

**Main Navigation**
- `/dashboard` - Overview dashboard with metrics, recent activity, and insights
- `/dashboard/profile` - User profile settings, plan management, and account operations

**Content Management**
- `/dashboard/posts` - Social media posts management and analysis results
- `/dashboard/posts/[slug]` - Provider-specific post listings (e.g., `/dashboard/posts/youtube`)
- `/dashboard/comments` - Comment analysis and sentiment tracking
- `/dashboard/analyse` - Content analysis tools and bulk operations

**Platform Integration**
- `/dashboard/integrations` - Social media platform connections and OAuth management
- `/dashboard/competitors` - Competitor sentiment tracking and comparative analysis
- `/dashboard/jobs` - Background task monitoring, queue status, and job history

## Navigation Implementation

### Layout Hierarchy

**Root Layout** (`app/layout.tsx`)
- Global providers (Mantine, NextAuth)
- Theme configuration and CSS custom properties
- Notification system setup

**Dashboard Layout** (`app/dashboard/layout.tsx`)
- Authentication check with redirect logic
- Session validation and user context
- Integration with `DashboardLayout` component

**Page-Specific Layouts**
- Landing page layout for marketing content
- Dashboard layout with sidebar navigation
- Public page layout for features/pricing

### Navigation Components

**Authenticated Navigation** (`AuthenticatedNavigationMenu`)
- Mobile-responsive header with hamburger menu
- User profile dropdown with logout functionality
- Notification indicators and quick actions

**Sidebar Navigation** (`SidebarNavigation`)
- Feature-based navigation with active state indicators
- Collapsible on mobile with breakpoint management
- Icon-based navigation with clear labeling

### Route Protection Strategy

**Authentication Guards**
- Dashboard layout checks `session?.user?.id`
- Automatic redirect to `/` for unauthenticated users
- Graceful handling of session expiration

**Post-Authentication Flow**
- Successful login redirects to `/dashboard`
- Landing page redirects authenticated users to dashboard
- Breadcrumb navigation for deep linking

## Dynamic Routing Patterns

### Provider-Specific Routes
- `/dashboard/posts/[slug]` - Dynamic provider slug (youtube, reddit, etc.)
- Slug validation against available providers
- Fallback handling for unsupported providers

### Parameterized Navigation
- Search parameters for filtering and pagination
- URL state management for dashboard filters
- Deep linking support for specific analysis views

## Mobile Navigation

### Responsive Breakpoints
- **Desktop**: Full sidebar navigation (>1024px)
- **Tablet**: Collapsible sidebar with overlay (768px-1024px)  
- **Mobile**: Drawer-based navigation (<768px)

### Touch-Friendly Interactions
- Large tap targets for mobile navigation
- Swipe gestures for drawer open/close
- Optimized spacing for mobile viewports

## Navigation State Management

### Active State Handling
- URL-based active state detection
- Visual indicators for current page/section
- Breadcrumb generation from route structure

### Client-Side Navigation
- Next.js router for smooth transitions
- Prefetching for improved performance
- Loading states during route transitions

## Integration with Authentication

### Protected Route Patterns
- Layout-level authentication checks
- Server-side session validation
- Client-side route guards for sensitive operations

### OAuth Callback Handling
- NextAuth.js handles OAuth return URLs
- Integration-specific callback processing
- Error handling for failed OAuth flows
