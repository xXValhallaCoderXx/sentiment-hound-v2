# FINAL PRD: Enhance Settings Page UI/UX

## 1. Overview

This feature enhances the existing Settings page (located at `/dashboard/profile`) to align with the brand's premium aesthetic, improve information hierarchy, and create a more visually engaging experience. The enhancement focuses on UI/UX improvements without adding new functionality.

The primary goals are to:

- Replace off-brand sidebar branding with official theme-aware Logo component
- Add proper page header structure for better visual hierarchy
- Redesign the 'Plan & Usage' card for improved scannability and visual appeal
- Enhance the 'Account Management' card with better structure and user profile information

## 2. User Stories

- As a user, I want to see consistent branding in the sidebar so that the interface feels cohesive across the application
- As a user, I want a clear page title and description so that I understand the purpose of the Settings page
- As a user, I want to easily scan my plan and usage information so that I can quickly understand my current status
- As a user, I want my token usage visualized clearly so that I can see how much I've used at a glance
- As a user, I want to see my account information prominently so that I feel the page is complete and comprehensive
- As a user, I want account management options to feel structured and organized so that I can find what I need efficiently

## 3. Functional Requirements

### FR1. Sidebar Branding Update

**Technical Implementation:**

- Utilize existing `Logo` component from `@/components/atoms/Logo/Logo.tsx`
- Replace current hardcoded blue "Sentiment Hound" text in `SidebarNavigation.tsx`
- Logo component already supports theme-aware styling with `main-logo.png`

**Acceptance Criteria:**

- Given I am viewing any page with the sidebar, when I look at the top of the sidebar, then I see the official Logo component with logomark and logotype instead of blue "Sentiment Hound" text
- Given I am in dark mode, when I view the sidebar logo, then it displays with appropriate theme contrast
- Given I am in light mode, when I view the sidebar logo, then it displays with appropriate theme contrast
- Given I am on any page, when I view the sidebar logo, then it maintains consistent sizing (50px height) and positioning

### FR2. Settings Page Header Implementation

**Technical Implementation:**

- Add header structure to `ProfileContent.tsx` component
- Use Mantine Typography system with H1 for title, secondary text for subtitle
- Follow existing spacing patterns from theme configuration

**Acceptance Criteria:**

- Given I am on the Settings page, when the page loads, then I see a large bold "Settings" title using H1 typography at the top of the main content area
- Given I am on the Settings page, when I view the header, then I see a dimmed sub-headline reading "Manage your plan, usage, and account settings" below the title
- Given I am on the Settings page, when I view the header, then it appears above all cards with proper spacing (following theme.other.transitions pattern)
- Given I am on different screen sizes, when I view the header, then it maintains proper hierarchy and readability

### FR3. Plan & Usage Card Redesign

**Technical Implementation:**

- Modify existing `PlanUsageCard.tsx` component structure
- Implement row-based layout with left-aligned labels and right-aligned values
- Utilize existing `Badge` component from atoms with current color scheme
- Maintain existing `TokenUsageProgress` component functionality
- Progress bar uses primary accent color (#FF4500) as defined in theme

**Acceptance Criteria:**

- Given I am viewing the Plan & Usage card, when I look at the content, then I see information organized in rows with left-aligned labels and right-aligned values
- Given I am viewing the Current Plan row, when I see the right side, then I see the existing Badge component displaying plan name (e.g., "DEVELOPER")
- Given I am viewing the Token Allowance row, when I see the content, then it displays "One-Time Token Allowance" on the left and the allowance value (e.g., "50,000") on the right
- Given I am viewing the Tokens Used row, when I see the content, then it displays "Tokens Used" on the left and current usage (e.g., "0") on the right
- Given I am viewing the Usage Bar, when present, then I see the existing TokenUsageProgress component with thin horizontal progress bar using primary accent color (#FF4500)
- Given I interact with the card, when I hover over it, then it provides default Mantine Card hover feedback

### FR4. Account Management Card Enhancement

**Technical Implementation:**

- Extend existing `AccountManagementCard.tsx` component
- Add Profile section above existing Danger Zone
- Use Mantine `Divider` component for visual separation
- Access user email from existing session/user data flow
- Display all available user information from current data model

**Acceptance Criteria:**

- Given I am viewing the Account Management card, when I look at the top section, then I see a "Profile" sub-heading using appropriate typography weight (fw={600})
- Given I am viewing the Profile section, when I see the content, then I see the user's email displayed in a read-only format with "Email" label on the left and actual email value on the right
- Given I am viewing the Profile section, when available, then I see additional user information fields (name, ID, creation date) following the same left-label, right-value pattern
- Given I am viewing the Account Management card, when I scroll down, then I see the existing Danger Zone section separated by a Mantine Divider component
- Given I am viewing the complete card, when I assess the structure, then the Profile section appears above the Danger Zone with clear visual separation

## 4. Technical Specifications

### Component Modifications

**SidebarNavigation.tsx:**

- Import and use `Logo` component in logoSection
- Replace hardcoded text with `<Logo size={40} showText={true} />`
- Maintain existing responsive behavior

**ProfileContent.tsx:**

- Add page header structure above existing Stack
- Use Mantine `Title` and `Text` components for hierarchy
- Implement proper spacing using theme standards

**PlanUsageCard.tsx:**

- Restructure layout from current stacked format to row-based format
- Maintain existing data flow and props interface
- Use `Group` components for left-right alignment
- Preserve existing TokenUsageProgress integration

**AccountManagementCard.tsx:**

- Add Profile section as new top-level Stack item
- Import and use user data from parent component
- Implement Divider component between sections
- Extend props interface to accept user data

### Data Flow

- User email available through existing session authentication
- Additional user data accessible via existing Prisma user model
- No new API endpoints or data fetching required
- Maintain existing error handling patterns

### Styling Approach

- Leverage existing CSS modules pattern
- Use Mantine component props for styling where possible
- Follow atomic design structure for any new sub-components
- Maintain theme-aware color usage (primary.5 for primary accent)

### Responsive Design

- Maintain existing responsive breakpoints
- Use Mantine's responsive utilities (`visibleFrom`, `hiddenFrom`)
- Ensure proper mobile layout for new header structure
- Test existing card responsive behavior with new layouts

## 5. Out of Scope (Non-Goals)

- Adding new functionality or features to the Settings page
- Modifying data sources, APIs, or backend services
- Changing the underlying route structure or navigation patterns
- Adding new account management features beyond existing Danger Zone
- Implementing billing or subscription management interfaces
- Adding user profile editing capabilities
- Modifying existing token usage calculation logic
- Creating new database models or data structures
- Implementing new authentication or authorization features

## 6. Success Metrics

- **Visual Consistency Score:** Sidebar branding matches official brand guidelines across all pages using standardized Logo component
- **User Task Completion Time:** 15% reduction in time to locate plan information through improved scannability and row-based layout
- **Page Hierarchy Clarity:** 90% of users can identify the page purpose within 3 seconds of loading through prominent header structure
- **Information Accessibility:** Users can quickly scan all account information in Profile section without scrolling through danger zone

## 7. Implementation Dependencies

### Required Components (Existing)

- `@/components/atoms/Logo/Logo.tsx` - Theme-aware logo component
- `@/components/atoms/Badge/Badge.tsx` - Reusable badge component
- `@/components/molecules/TokenUsageProgress/TokenUsageProgress.tsx` - Progress visualization
- Mantine UI components: `Title`, `Text`, `Group`, `Stack`, `Divider`, `Card`

### Theme Configuration

- Primary accent color: `#FF4500` (theme.colors.primary[5])
- Typography: Inter font family with established font weights
- Spacing: Follow existing theme.other.transitions patterns

### Data Sources

- Session user data (email, ID, creation date)
- Existing plan data from Prisma user.plan relationship
- Current token usage from existing API endpoints

## 8. Risk Mitigation

**Layout Breaking Changes:** Maintain existing component interfaces and prop structures to prevent breaking changes in parent components.

**Performance Impact:** All modifications use existing components and data sources, minimizing performance impact.

**Theme Compatibility:** All styling follows established theme patterns and uses existing color variables.

**Mobile Responsiveness:** Leverage existing responsive patterns and test across all supported breakpoints.

## 9. Acceptance Testing

### Test Cases

**TC1: Sidebar Logo Display**

- Verify Logo component renders in sidebar across all dashboard pages
- Confirm theme-appropriate styling in both light and dark modes
- Validate consistent sizing and positioning

**TC2: Settings Page Header**

- Confirm header appears above all cards with proper typography
- Verify responsive behavior on mobile devices
- Test visual hierarchy clarity

**TC3: Plan & Usage Card Layout**

- Validate row-based information display
- Confirm Badge component integration for plan display
- Test TokenUsageProgress component functionality
- Verify hover states and interactive feedback

**TC4: Account Management Profile Section**

- Confirm user information display in proper format
- Validate Divider separation from Danger Zone
- Test with various user data scenarios (complete/incomplete profiles)

**TC5: Cross-browser Compatibility**

- Test all enhancements across supported browsers
- Verify consistent rendering and functionality
- Confirm accessibility compliance maintained

This finalized PRD incorporates all user feedback, resolves technical implementation details through codebase analysis, and provides a clear roadmap for engineering implementation without assumptions or open questions.
