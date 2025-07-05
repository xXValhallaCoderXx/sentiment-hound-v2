# FINAL PRD: Global UI & Layout Unification for Authenticated Routes

**Document ID:** SH-PRD-015.2  
**Author:** Principal Software Engineer  
**Status:** FINAL  
**Date:** July 05, 2025

## 1. Overview

This feature involves a comprehensive refactoring of all authenticated dashboard routes to utilize a single, standardized "App Shell" layout pattern. The initiative addresses inconsistent user experience across different pages, fixes spacing and layout issues, and resolves the current logout modal duplication problem. The primary goal is to establish a unified, polished, and maintainable layout system using Next.js 15 App Router conventions while ensuring consistent navigation and improved user experience across all authenticated routes.

## 2. User Stories

- **As a dashboard user**, I want all authenticated pages to have consistent layout and navigation so that I can efficiently navigate between features without learning different interfaces
- **As a dashboard user**, I want the sidebar navigation to remain consistent across all pages so that I always know where to find specific features
- **As a dashboard user**, I want appropriate spacing and content width constraints so that the interface feels balanced and readable on large screens
- **As a dashboard user**, I want a single, correctly styled logout confirmation modal when I click logout so that I'm not confused by multiple overlapping dialogs
- **As a mobile user**, I want the navigation to work consistently across all authenticated pages so that I have the same experience regardless of screen size
- **As a developer**, I want a single layout component that handles the App Shell so that future pages can be created without duplicating layout logic

## 3. Functional Requirements

### FR1. Standardized App Shell Layout System

**Acceptance Criteria:**

- Given any authenticated route under `/dashboard`, when the page loads, then it displays the standard App Shell layout with sidebar navigation and main content area
- Given the App Shell layout, when rendered, then it includes the Living Canvas background, sidebar navigation, header, and constrained main content area with a maximum width of 1280px
- Given a page using the App Shell, when viewed on desktop (>1024px), then the sidebar is always visible and the content is properly constrained with 48px top padding and centered horizontally

### FR2. Consolidated Sidebar Navigation

**Acceptance Criteria:**

- Given the sidebar navigation, when rendered, then it displays only: Dashboard link, Source Management link (disabled), Settings section header, Profile link, and Logout link
- Given the Source Management link, when displayed, then it appears disabled/grayed out and does not navigate when clicked
- Given the sidebar navigation component, when the logout modal implementation exists, then it is removed to prevent conflicts with the unified logout modal in `DashboardLayout`
- Given the Logout link, when clicked, then it triggers only the `DashboardLayout`'s logout confirmation modal

### FR3. Single Logout Modal Implementation

**Acceptance Criteria:**

- Given the logout link in the sidebar, when clicked, then only one confirmation modal appears using the `LogoutConfirmationModal` component
- Given the logout confirmation modal, when displayed, then the logout button uses the primary theme color (red) instead of the current blue color
- Given the `SidebarNavigation` component's logout modal, when the feature is implemented, then this modal implementation is completely removed to prevent conflicts
- Given the logout modal styling, when displayed, then it uses the unified design from the existing `LogoutConfirmationModal` component with red primary color

### FR4. Layout Spacing and Content Constraints

**Acceptance Criteria:**

- Given the main content area, when displayed, then it has a maximum width of 1280px and is horizontally centered as defined in the existing `DashboardLayout.module.css`
- Given the main content area, when rendered, then it maintains the existing 48px top padding from the header
- Given mobile responsive behavior (<1024px), when viewing any page, then the content padding is reduced to 24px horizontally and 16px vertically as currently implemented
- Given the mobile drawer, when opened, then it automatically closes when navigating between pages

### FR5. Page Content Simplification

**Acceptance Criteria:**

- Given any authenticated page component, when refactored, then it contains only page-specific content without layout or navigation logic
- Given pages currently using `PageLayout` template, when refactored to use the App Shell, then the `PageLayout` wrapper is removed in favor of the unified layout system
- Given the current `/dashboard/layout.tsx`, when utilized, then all authenticated routes inherit the standardized `DashboardLayout` component automatically

### FR6. Error Boundaries and Loading States

**Acceptance Criteria:**

- Given the App Shell layout, when a page-level error occurs, then it displays an appropriate error state using the existing `ErrorState` component
- Given page transitions, when content is loading, then simple loading states are displayed using existing `ListLoadingSkeleton` or `Skeleton` components where appropriate
- Given error notifications, when needed, then they utilize the existing `ErrorNotification` component for consistent error messaging

### FR7. Navigation State Management

**Acceptance Criteria:**

- Given the navigation system, when navigating between pages, then the active navigation state is properly synchronized using the existing `usePathname` hook and navigation utilities
- Given the `NavigationLink` component, when rendering navigation items, then it correctly displays active states based on the current route path
- Given the navigation state management, when implemented, then it leverages existing patterns from `navigation.types.ts` and `navigation.utils.ts`

## 4. Out of Scope (Non-Goals)

- Redesigning the visual style or color scheme of existing components
- Modifying the functionality of individual dashboard pages beyond layout standardization
- Implementing new navigation features or links beyond the specified MVP set
- Changing the authentication system or session management
- Modifying the database schema or API endpoints
- Redesigning the Landing Page or other non-authenticated routes
- Implementing new responsive breakpoints beyond the existing strategy
- Adding new animations or transitions beyond the existing Living Canvas background

## 5. Technical Considerations

### Integration Points

- **Layout Foundation**: Utilize existing `DashboardLayout` component in `/components/templates/DashboardLayout/DashboardLayout.tsx` as the base App Shell implementation
- **Navigation Component**: Refactor `SidebarNavigation` component to remove duplicate logout modal while maintaining navigation structure
- **CSS Architecture**: Leverage existing CSS modules pattern in `DashboardLayout.module.css` and Mantine theme variables from `theme.ts`
- **Route Structure**: Work within existing `/dashboard` route group structure and `layout.tsx` implementation
- **Authentication**: Integrate with existing NextAuth.js session management in the current layout

### Technical Implementation Details

- **Living Canvas Background**: Implement the existing Living Canvas background pattern from landing pages within the dashboard layout for visual consistency
- **Color Scheme**: Update `LogoutConfirmationModal` to use `color="primary"` instead of `color="blue"` to utilize the red primary color defined in the Mantine theme
- **Error Handling**: Integrate existing error boundary patterns using `ErrorState` component for graceful error handling at the layout level
- **Loading States**: Implement simple loading skeletons using existing components like `ListLoadingSkeleton` for page transitions
- **Navigation State**: Utilize existing `usePathname` hook and navigation utilities for active state management
- **Responsive Design**: Maintain existing mobile breakpoint strategy (1024px for lg) and drawer behavior with auto-close functionality

### Dependencies

- Next.js 15 App Router layout system (existing)
- Mantine UI component library and theming system (existing)
- Existing authentication middleware and session handling (existing)
- Current responsive design breakpoints and CSS custom properties (existing)
- Existing error handling and loading state components (existing)

### Technical Constraints

- Must maintain backward compatibility with existing authenticated routes
- Should not require database migrations or API changes
- Must preserve existing component prop interfaces where possible
- Should leverage existing CSS custom properties and theme variables
- Must work within the current Mantine theme configuration with red primary color

### File Modifications Required

**Primary Changes:**

- `/apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx` - Remove duplicate logout modal implementation
- `/apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.tsx` - Update button color to use primary theme color
- `/apps/web/components/templates/DashboardLayout/DashboardLayout.module.css` - Add Living Canvas background integration if needed

**Secondary Changes:**

- Individual page components currently using `PageLayout` - Remove wrapper and simplify to content-only components
- Error boundary integration at the layout level using existing `ErrorState` component
- Loading state integration using existing skeleton components

## 6. Success Metrics

- **Layout Consistency**: 100% of authenticated routes use the standardized App Shell layout
- **Modal Conflict Resolution**: Zero instances of duplicate logout modals appearing
- **User Experience Improvement**: Consistent navigation placement and behavior across all authenticated pages with proper content width constraints (1280px max-width)
- **Developer Experience**: Reduced code duplication in page components by eliminating individual layout implementations
- **Error Handling**: Graceful error states displayed using unified error components
- **Loading Experience**: Consistent loading states across page transitions using existing skeleton patterns

## 7. Implementation Priority

**Phase 1 (Critical):**

1. Remove duplicate logout modal from `SidebarNavigation` component
2. Update logout modal styling to use primary (red) color
3. Ensure all routes utilize the existing `DashboardLayout`

**Phase 2 (Important):**

1. Integrate Living Canvas background into dashboard layout
2. Add error boundaries using existing `ErrorState` component
3. Implement simple loading states with existing skeleton components

**Phase 3 (Enhancement):**

1. Refactor individual pages to remove `PageLayout` wrappers
2. Optimize navigation state management
3. Final UI polish and testing

## 8. Technical Notes

- The existing `DashboardLayout` component already implements most required functionality including responsive sidebar, mobile drawer, and content constraints
- The current theme configuration in `theme.ts` defines red as the primary color, aligning with brand requirements
- Existing error handling patterns with `ErrorState` and `ErrorNotification` components provide a solid foundation for error boundaries
- Loading state patterns are already established with `ListLoadingSkeleton` and other skeleton components
- Navigation state management utilities exist in `navigation.utils.ts` and `navigation.types.ts`
- The Living Canvas background implementation exists in landing page CSS modules and can be adapted for dashboard use
