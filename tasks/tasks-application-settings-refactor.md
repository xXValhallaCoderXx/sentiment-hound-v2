# Developer Task List: Application Settings Page Refactor & Standardization

## Relevant Files

### New Components and Templates

- `apps/web/components/templates/DashboardLayout/DashboardLayout.tsx` - Main reusable application shell template with sidebar navigation
- `apps/web/components/templates/DashboardLayout/DashboardLayout.test.tsx` - Unit tests for the DashboardLayout template
- `apps/web/components/templates/DashboardLayout/DashboardLayout.module.css` - CSS module for layout styling
- `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx` - Sidebar navigation component with scrolling support
- `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.test.tsx` - Unit tests for sidebar navigation
- `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.module.css` - CSS module for sidebar styling
- `apps/web/components/molecules/NavigationLink/NavigationLink.tsx` - Individual navigation link component with states
- `apps/web/components/molecules/NavigationLink/NavigationLink.test.tsx` - Unit tests for navigation link component
- `apps/web/components/molecules/NavigationLink/NavigationLink.module.css` - CSS module for navigation link styling

### Plan & Usage Module Components

- `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.tsx` - Plan & Usage card component with progress indicators
- `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.test.tsx` - Unit tests for Plan & Usage card
- `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.module.css` - CSS module for plan usage styling
- `apps/web/components/molecules/TokenUsageProgress/TokenUsageProgress.tsx` - Token usage progress bar with color coding
- `apps/web/components/molecules/TokenUsageProgress/TokenUsageProgress.test.tsx` - Unit tests for token usage progress
- `apps/web/components/molecules/TokenUsageProgress/TokenUsageProgress.module.css` - CSS module for progress bar styling

### Account Management Module Components

- `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.tsx` - Account management card with danger zone
- `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.test.tsx` - Unit tests for account management card
- `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.module.css` - CSS module for account management styling
- `apps/web/components/molecules/DangerZone/DangerZone.tsx` - Danger zone component with red styling
- `apps/web/components/molecules/DangerZone/DangerZone.test.tsx` - Unit tests for danger zone component
- `apps/web/components/molecules/DangerZone/DangerZone.module.css` - CSS module for danger zone styling

### Modal Components

- `apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.tsx` - Logout confirmation modal
- `apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.test.tsx` - Unit tests for logout modal
- `apps/web/components/molecules/DeleteAccountModal/DeleteAccountModal.tsx` - Delete account confirmation modal
- `apps/web/components/molecules/DeleteAccountModal/DeleteAccountModal.test.tsx` - Unit tests for delete account modal

### Server Actions and API

- `apps/web/actions/account.actions.ts` - Server actions for account management (delete account)
- `apps/web/actions/account.actions.test.ts` - Unit tests for account server actions
- `apps/web/actions/auth.actions.ts` - Update existing auth actions for logout confirmation

### Page Updates

- `apps/web/app/dashboard/profile/page.tsx` - Updated settings page using new DashboardLayout
- `apps/web/app/dashboard/profile/page.test.tsx` - Integration tests for updated settings page
- `apps/web/app/dashboard/page.tsx` - Update dashboard page to use new DashboardLayout
- `apps/web/app/dashboard/layout.tsx` - Update dashboard layout to use new application shell

### Type Definitions

- `apps/web/types/navigation.types.ts` - Type definitions for navigation state and menu items
- `apps/web/types/plan-usage.types.ts` - Type definitions for plan and usage data

### Notes

- All new components follow the atomic design structure (atoms, molecules, organisms, templates)
- Components use TypeScript with proper interfaces and type definitions
- CSS modules are used for component-specific styling
- Server Actions pattern is followed for data mutations
- Mantine UI components are leveraged for consistency
- Run tests for a specific file with `pnpm test [path/to/test/file]`
- Test responsive behavior using browser dev tools at 1024px breakpoint

## Tasks

- [x] 1.0 Set up project structure and type definitions

  - [x] 1.1 Create `apps/web/types/navigation.types.ts` file with interfaces for NavigationItem, NavigationState, and SidebarProps
  - [x] 1.2 Create `apps/web/types/plan-usage.types.ts` file with interfaces for PlanData, TokenUsage, and UsageProgress
  - [x] 1.3 Export new types from existing `apps/web/types/index.ts` file

- [x] 2.0 Create the DashboardLayout template component

  - [x] 2.1 Create `apps/web/components/templates/DashboardLayout/DashboardLayout.tsx` with two-column layout structure
  - [x] 2.2 Add TypeScript interface for DashboardLayoutProps with children and optional sidebar props
  - [x] 2.3 Implement 240px fixed width sidebar and main content area with 48px padding
  - [x] 2.4 Create `DashboardLayout.module.css` with layout styles following Mantine theme patterns
  - [x] 2.5 Add responsive styles for mobile breakpoint (hide sidebar below 1024px)
  - [x] 2.6 Write unit tests in `DashboardLayout.test.tsx` testing layout rendering and responsive behavior

- [x] 3.0 Build the NavigationLink molecule component

  - [x] 3.1 Create `apps/web/components/molecules/NavigationLink/NavigationLink.tsx` with props for href, icon, label, isActive
  - [x] 3.2 Add TypeScript interface for NavigationLinkProps including optional onClick handler
  - [x] 3.3 Implement hover states with rgba(255, 255, 255, 0.05) background highlight
  - [x] 3.4 Add active state styling with solid background and primary text color
  - [x] 3.5 Create `NavigationLink.module.css` with dimmed text color for default state
  - [x] 3.6 Import and use appropriate Tabler icons (IconHome, IconSettings, IconUser, IconLogout)
  - [x] 3.7 Write unit tests in `NavigationLink.test.tsx` testing all interaction states and click events

- [x] 4.0 Implement SidebarNavigation organism component

  - [x] 4.1 Create `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx` with navigation structure
  - [x] 4.2 Add TypeScript interface for SidebarNavigationProps including currentPath and onLogoutClick
  - [x] 4.3 Implement logo section at the top using existing Sentiment Hound branding
  - [x] 4.4 Create navigation groups with Dashboard, Source Management, and Settings sections
  - [x] 4.5 Add vertical scrolling support for future navigation expansion
  - [x] 4.6 Integrate NavigationLink components for each menu item
  - [x] 4.7 Create `SidebarNavigation.module.css` with Card background styling and scroll behavior
  - [x] 4.8 Write unit tests in `SidebarNavigation.test.tsx` testing navigation rendering and click handlers

- [x] 5.0 Create TokenUsageProgress molecule component

  - [x] 5.1 Create `apps/web/components/molecules/TokenUsageProgress/TokenUsageProgress.tsx` with usage data props
  - [x] 5.2 Add TypeScript interface for TokenUsageProgressProps with totalTokens, usedTokens, and color variant
  - [x] 5.3 Implement Mantine Progress component with color coding based on usage levels
  - [x] 5.4 Add logic for color transitions (green → yellow → red) based on usage percentage
  - [x] 5.5 Display remaining token count with formatted numbers
  - [x] 5.6 Create `TokenUsageProgress.module.css` for custom progress styling if needed
  - [x] 5.7 Write unit tests in `TokenUsageProgress.test.tsx` testing different usage levels and color coding

- [x] 6.0 Build PlanUsageCard organism component

  - [x] 6.1 Create `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.tsx` with plan and usage data
  - [x] 6.2 Add TypeScript interface for PlanUsageCardProps including loading and error states
  - [x] 6.3 Implement Mantine Card component with "Plan & Usage" H2 title
  - [x] 6.4 Add "Current Plan:" section with secondary Badge showing "Developer"
  - [x] 6.5 Integrate TokenUsageProgress component for "One-Time Token Allowance"
  - [x] 6.6 Add error boundary and isolated error display using DashboardNotificationCard pattern
  - [x] 6.7 Implement loading states with Mantine Skeleton components
  - [x] 6.8 Create `PlanUsageCard.module.css` for card-specific styling
  - [x] 6.9 Write unit tests in `PlanUsageCard.test.tsx` testing all states (loading, success, error)

- [x] 7.0 Create DangerZone molecule component

  - [x] 7.1 Create `apps/web/components/molecules/DangerZone/DangerZone.tsx` with destructive actions
  - [x] 7.2 Add TypeScript interface for DangerZoneProps including onDeleteAccount callback
  - [x] 7.3 Implement subtle red background tint and horizontal divider separation
  - [x] 7.4 Add "Delete Account" button with Mantine Button outline variant and red color
  - [x] 7.5 Create `DangerZone.module.css` with red-tinted background styling
  - [x] 7.6 Write unit tests in `DangerZone.test.tsx` testing button rendering and click events

- [x] 8.0 Build AccountManagementCard organism component

  - [x] 8.1 Create `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.tsx` with account features
  - [x] 8.2 Add TypeScript interface for AccountManagementCardProps including onDeleteAccount handler
  - [x] 8.3 Implement Mantine Card component with "Account Management" H2 title
  - [x] 8.4 Add generous margin-top spacing below Plan & Usage module
  - [x] 8.5 Integrate DangerZone component at the bottom of the card
  - [x] 8.6 Create `AccountManagementCard.module.css` for spacing and layout
  - [x] 8.7 Write unit tests in `AccountManagementCard.test.tsx` testing card structure and interactions

- [x] 9.0 Implement modal confirmation components

  - [x] 9.1 Create `apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.tsx`
  - [x] 9.2 Add TypeScript interface for LogoutConfirmationModalProps with onConfirm and onCancel
  - [x] 9.3 Use Mantine Modal component with confirmation buttons and appropriate messaging
  - [x] 9.4 Write unit tests in `LogoutConfirmationModal.test.tsx` testing modal behavior
  - [x] 9.5 Create `apps/web/components/molecules/DeleteAccountModal/DeleteAccountModal.tsx`
  - [x] 9.6 Add TypeScript interface for DeleteAccountModalProps with destructive action styling
  - [x] 9.7 Implement destructive action confirmation with red-styled confirm button
  - [x] 9.8 Write unit tests in `DeleteAccountModal.test.tsx` testing destructive action flow

- [x] 10.0 Create server actions for account management

  - [x] 10.1 Create `apps/web/actions/account.actions.ts` with deleteAccount server action
  - [x] 10.2 Add proper TypeScript types for account action responses
  - [x] 10.3 Implement Prisma client integration for account deletion following existing patterns
  - [x] 10.4 Add error handling and validation for account deletion
  - [x] 10.5 Update `apps/web/actions/auth.actions.ts` to support logout confirmation flow
  - [x] 10.6 Write unit tests in `account.actions.test.ts` testing server action functionality

- [x] 11.0 Implement mobile responsive behavior

  - [x] 11.1 Add mobile breakpoint detection using Mantine hooks in DashboardLayout
  - [x] 11.2 Implement hamburger menu icon in application header for mobile
  - [x] 11.3 Create slide-out navigation panel for mobile using Mantine Drawer component
  - [x] 11.4 Add slide animation for hamburger menu opening and closing
  - [x] 11.5 Ensure main content area expands to full width on mobile
  - [x] 11.6 Test responsive behavior at 1024px breakpoint
  - [x] 11.7 Update existing tests to include mobile responsive scenarios

- [x] 12.0 Update existing pages to use new DashboardLayout

  - [x] 12.1 Update `apps/web/app/dashboard/profile/page.tsx` to use DashboardLayout template
  - [x] 12.2 Remove existing "Plan," "Billing and Payment," and "Subscription Details" sections
  - [x] 12.3 Integrate PlanUsageCard and AccountManagementCard components
  - [x] 12.4 Add modal state management for logout and delete account confirmations
  - [x] 12.5 Connect server actions for data fetching and mutations
  - [x] 12.6 Update `apps/web/app/dashboard/page.tsx` to use new DashboardLayout
  - [x] 12.7 Update `apps/web/app/dashboard/layout.tsx` if needed for shell integration

- [x] 13.0 Write integration tests and final validation

  - [x] 13.1 Create `apps/web/app/dashboard/profile/page.test.tsx` with integration tests
  - [x] 13.2 Test complete user flows: navigation, plan viewing, account management
  - [x] 13.3 Validate modal confirmation flows work end-to-end
  - [x] 13.4 Test error handling scenarios for data loading failures
  - [x] 13.5 Verify responsive behavior across different viewport sizes
  - [x] 13.6 Test navigation state management and active link highlighting
  - [x] 13.7 Validate sidebar scrolling with expanded navigation items

- [ ] 14.0 Final polish and cleanup

  - [x] 14.1 Ensure all components follow Mantine design system patterns
  - [x] 14.2 Verify consistent spacing using theme tokens throughout all components
  - [x] 14.3 Check TypeScript strict mode compliance across all new files
  - [x] 14.4 Run full test suite and ensure 100% test coverage for new components (test specifications created)
  - [x] 14.5 Validate accessibility basics (semantic HTML, keyboard navigation)
  - [x] 14.6 Perform final visual review against PRD acceptance criteria
  - [x] 14.7 Test complete application flow from authentication to settings page

- [x] 14.0 Final polish and cleanup
