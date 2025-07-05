# PRD FINAL: Application Settings Page Refactor & Standardization

**Document ID:** SH-PRD-014  
**Author:** Senior Product Manager  
**Status:** FINAL  
**Date:** July 05, 2025

## 1. Overview

This feature involves a comprehensive refactor of the `/app/dashboard/profile` page (currently acting as the settings page) to establish a standardized, design-system-compliant application shell and simplify the settings content for the MVP alpha release. The refactor will create a reusable two-column layout pattern with persistent sidebar navigation that will serve as the foundation for all authenticated pages in the Sentiment Hound application.

The primary goals are to: (1) establish a consistent navigation pattern across the authenticated experience, (2) simplify the current settings page to focus on essential MVP features, and (3) create a scalable foundation for future feature expansion.

## 2. User Stories

**As an authenticated user**, I want to navigate between different sections of the application easily so that I can access features without losing context.

**As an authenticated user**, I want to see my current plan status and token usage clearly so that I can understand my account limits and usage.

**As an authenticated user**, I want to access account management functions like deleting my account so that I have control over my data and privacy.

**As a mobile user**, I want to access navigation through a hamburger menu so that I can navigate efficiently on smaller screens.

**As a user**, I want the sidebar navigation to clearly indicate which page I'm currently viewing so that I always know my location within the application.

**As a user**, I want consistent navigation patterns across all authenticated pages so that I can develop muscle memory and navigate efficiently.

## 3. Functional Requirements

**FR1. Application Shell Implementation**

- **Acceptance Criteria:**
  - Given I am an authenticated user on any dashboard page, when the page loads, then I see a persistent left sidebar with 240px fixed width
  - Given I am viewing the application shell, when I observe the layout, then the sidebar background is visually distinct from the main content area using Card background styling
  - Given I am viewing the main content area, when I observe the layout, then it has 48px internal padding and fills the remaining screen width
  - Given the sidebar contains many navigation items in the future, when I scroll within the sidebar, then it supports vertical scrolling functionality

**FR2. Sidebar Navigation Structure**

- **Acceptance Criteria:**
  - Given I am viewing the sidebar, when I look at the header section, then I see the official Sentiment Hound logomark and logotype
  - Given I am viewing the navigation links, when I scan the sidebar, then I see Dashboard, Source Management, Profile, and Logout options
  - Given I am viewing the Settings group, when I look at the navigation structure, then Profile and Logout are grouped under a "Settings" section
  - Given I am on a specific page, when I view the sidebar, then the current page link has a solid background highlight and high-contrast text color
  - Given I am viewing navigation icons, when I examine each link, then they use the current Tabler icons from the existing codebase (IconHome, IconSettings, IconUser, IconLogout)

**FR3. Navigation Link Interaction States**

- **Acceptance Criteria:**
  - Given I am viewing navigation links in their default state, when I observe them, then icons and text use dimmed text color
  - Given I hover over a navigation link, when the hover state activates, then the background gains a subtle highlight (rgba(255, 255, 255, 0.05))
  - Given I am on the current page, when I view the corresponding navigation link, then it displays with active styling (solid background and primary text color)
  - Given I click on a navigation link, when the click event occurs, then the application navigates to the corresponding page
  - Given I click the logout link, when the click event occurs, then a modal confirmation dialog appears before processing the logout action

**FR4. Plan & Usage Module Implementation**

- **Acceptance Criteria:**
  - Given I am viewing the settings page, when I look at the top of the content area, then I see a Card component with "Plan & Usage" H2 title
  - Given I am viewing the Plan & Usage card, when I examine the content, then I see "Current Plan:" followed by a filled secondary Badge with "Developer" text using the theme's secondary variant
  - Given I am viewing the Plan & Usage card, when I look at the usage information, then I see "One-Time Token Allowance:" followed by the remaining token count (e.g., "50,000 Tokens remaining") with a visual progress bar indicator showing usage levels with color coding
  - Given token usage data fails to load, when I view the Plan & Usage section, then I see an isolated error component indicating the data loading issue without affecting other page sections

**FR5. Account Management Module Implementation**

- **Acceptance Criteria:**
  - Given I am viewing the settings page, when I scroll below the Plan & Usage module, then I see a second Card component with "Account Management" H2 title and generous margin-top spacing
  - Given I am viewing the Account Management card, when I examine the bottom section, then I see a "Danger Zone" with subtle red background tint separated by a horizontal divider
  - Given I am viewing the Danger Zone, when I look at the content, then I see a "Delete Account" button with outline variant and red color styling
  - Given I click the Delete Account button, when the click event occurs, then a modal confirmation dialog with confirmation buttons appears before processing the destructive action

**FR6. Responsive Mobile Behavior**

- **Acceptance Criteria:**
  - Given I am viewing the application on a viewport less than 1024px wide, when the page loads, then the left sidebar is completely hidden
  - Given I am on mobile and the sidebar is hidden, when I look at the main application header, then I see a hamburger menu icon
  - Given I click the hamburger menu icon on mobile, when the click event occurs, then a slide-out navigation panel opens containing all navigation links
  - Given I am on mobile, when the sidebar is hidden, then the main content area expands to take up the full screen width
  - Given the mobile hamburger menu is open, when I interact with it, then it uses a slide animation for opening and closing

**FR7. Content Replacement Requirements**

- **Acceptance Criteria:**
  - Given I access the settings page, when the page renders, then the existing "Plan," "Billing and Payment," and three-plan "Subscription Details" sections are completely removed
  - Given the old content is removed, when I view the page, then only the new "Plan & Usage" and "Account Management" modules are visible
  - Given the page loads, when I examine the content structure, then it follows the new simplified two-card layout specification

## 4. Out of Scope (Non-Goals)

- **Billing Integration:** This refactor will not implement actual billing or payment processing functionality
- **Plan Upgrade/Downgrade Logic:** Changing plans or managing subscriptions is not included in this scope
- **Advanced Account Settings:** Features like password change, email preferences, or notification settings are excluded
- **Data Export Functionality:** Account deletion will not include data export or backup features in this iteration
- **Multi-language Support:** Internationalization is not included in this refactor
- **Advanced Responsive Breakpoints:** Only the mobile breakpoint (1024px) will be implemented
- **Accessibility Enhancements:** Beyond basic semantic HTML, advanced ARIA or screen reader optimizations are excluded
- **Analytics Integration:** User interaction tracking or analytics events are not included
- **Advanced Error Handling:** Complex error recovery mechanisms beyond isolated error displays are out of scope for this UI refactor
- **Source Management Implementation:** The Source Management navigation link will be present but non-functional for this iteration
- **Active State Persistence:** Navigation state persistence across page refreshes and browser sessions is excluded
- **Custom Logo Positioning:** Specific logomark dimensions and positioning will follow existing design system defaults

## 5. Technical Considerations

Based on comprehensive codebase analysis, the following technical implementation details are confirmed:

**Component Architecture & Design System:**

- Leverage existing atomic design structure in `apps/web/components/` (atoms, molecules, organisms, templates)
- Use established Mantine theme system from `lib/theme.ts` with semantic color tokens
- Implement as a reusable template in `components/templates/DashboardLayout.tsx` pattern
- Continue using existing Tabler Icons React library for consistency
- Utilize existing Card, Badge, Button, and Progress components from Mantine system
- Follow existing error handling patterns from `DashboardNotificationCard.tsx`

**Data & Authentication:**

- Integrate with existing NextAuth.js authentication system via `lib/next-auth.lib.ts`
- Use existing Prisma client patterns from `packages/database` for user and plan data access
- Follow Server Actions pattern from `actions/plan-usage.actions.ts` for data mutations
- Implement token usage display similar to existing `TokenUsageCard.tsx` component

**Responsive & Navigation:**

- Build on existing Mantine responsive utilities and breakpoint system
- Follow patterns from `SideDrawerNavigation.tsx` and `AuthenticatedNavigationMenu.tsx`
- Use existing hamburger menu implementation from `AppShell` component
- Leverage current navigation state management from `navigation.utils.ts`

**Modal Confirmations:**

- Implement logout and delete account confirmations using existing modal patterns
- Follow established destructive action styling conventions from the current design system

**Error Handling:**

- Use isolated error components per section to prevent cascading failures
- Follow existing error display patterns from `DashboardNotificationCard.tsx`
- Maintain graceful degradation for data loading failures

## 6. Success Metrics

- **Navigation Efficiency:** Reduce average time to navigate between dashboard sections by 25% through persistent sidebar navigation
- **User Engagement:** Increase settings page engagement time by 15% through simplified, focused content presentation
- **Mobile Usability:** Achieve 95% task completion rate for mobile navigation through hamburger menu implementation
- **Error Resilience:** Maintain 99% page functionality even when individual data sections fail to load
- **Design Consistency:** Achieve 100% compliance with existing Mantine design system patterns and components

## 7. Implementation Notes

**Priority Order:**

1. Create reusable DashboardLayout template component
2. Implement sidebar navigation with scrolling support
3. Build Plan & Usage module with progress indicators and error handling
4. Implement Account Management module with modal confirmations
5. Add responsive mobile behavior with slide animations
6. Replace existing profile page content

**Dependencies:**

- Existing Mantine theme and component library
- Current Tabler Icons React implementation
- Established authentication and database patterns
- Existing modal and error handling components

**Testing Considerations:**

- Verify responsive behavior at 1024px breakpoint
- Test modal confirmation flows for logout and delete account
- Validate error isolation when token data fails to load
- Confirm navigation state management across page transitions
- Test sidebar scrolling with expanded navigation items
