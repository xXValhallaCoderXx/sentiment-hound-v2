# PRD: Refactor "Analyse" Page for New Submissions

**Document ID:** SH-PRD-021  
**Author:** Architect  
**Status:** FINAL  
**Date:** July 06, 2025  
**Target Route:** `/app/dashboard/analyse`

---

## 1. Overview

This feature refactors the existing `/app/dashboard/analyse` page to serve as a dedicated, focused interface for users to submit new post URLs for sentiment analysis. The refactor transforms this page from a complex multi-provider integration interface into a streamlined single-card form optimized for quick URL submission and analysis initiation.

The primary goal is to create a frictionless entry point for users to start new sentiment analysis tasks while maintaining the robust error handling and success flows already established by the existing `startAnalysis` server action and `AnalyzeButton` component.

### Key Changes from Current Implementation

- **Current State**: The analyse page displays `YoutubeUrlForm` and `RedditJobButton` components for users with integrations, or a "No Integrations Found" message
- **Target State**: A simple, focused card-based form interface that works independently of existing integrations
- **Navigation Enhancement**: Addition of "Analyse" link to sidebar navigation for consistent access

---

## 2. User Stories

**Primary User Story:**

- As a **content creator or brand manager**, I want **to quickly submit a new social media URL for sentiment analysis** so that **I can monitor public opinion about my content or brand**.

**Supporting User Stories:**

- As a **user on the main dashboard**, I want **to click a prominent "+ Analyze New Post" button** so that **I can easily start a new analysis without searching through menus**.
- As a **user navigating the dashboard**, I want **an "Analyse" link in the sidebar navigation** so that **I can quickly access the analysis submission page**.
- As a **user submitting a URL**, I want **immediate validation feedback** so that **I know if my URL is valid before submitting**.
- As a **user with a successful submission**, I want **to be automatically redirected back to my dashboard** so that **I can see my new analysis appear in the list**.
- As a **user who encounters an error**, I want **clear error messages displayed on the same page** so that **I can correct the issue without losing my current context**.
- As a **mobile user**, I want **the analysis submission page to work seamlessly on my device** so that **I can analyze content while on the go**.

---

## 3. Functional Requirements

### FR1. Page Navigation and Layout

**Description:** Users can navigate to the analyze page through multiple paths and see a clean, focused interface.

**Acceptance Criteria:**

- Given a user is on the main dashboard (`/dashboard`), when they click the "+ Analyze New Post" button in the top right of the dashboard content area, then they are navigated to `/app/dashboard/analyse`
- Given a user is viewing the sidebar navigation, when they see the navigation links, then there is an "Analyse" link available for direct access
- Given a user is on the analyze page, when the page loads, then they see the standard App Shell with persistent sidebar and top header
- Given the page content loads, when rendered, then there is a single, centered Card component in the main content area
- Given any screen size, when the page is viewed, then the layout remains responsive and accessible

### FR2. URL Input and Validation

**Description:** Users can enter and validate social media URLs for analysis.

**Acceptance Criteria:**

- Given the analyze page is loaded, when displayed, then there is a large, prominent URL input field with placeholder text "https://..."
- Given the URL input is empty, when the page loads, then the "Start Analysis" button is disabled
- Given a user types in the URL input, when the input contains text, then the "Start Analysis" button becomes enabled
- Given a user enters an invalid URL format, when they attempt to submit, then appropriate validation error messages are displayed
- Given a user presses Enter in the URL input, when a valid URL is present, then the form submits automatically

### FR3. Form Submission and Server Action Integration

**Description:** The form integrates with the existing server action infrastructure.

**Acceptance Criteria:**

- Given a user clicks "Start Analysis" with a valid URL, when submitted, then the existing `startAnalysis` server action is called
- Given the server action is processing, when in progress, then the "Start Analysis" button shows a loading state with spinner
- Given multiple rapid clicks on submit, when occurring, then duplicate submissions are prevented by the loading state
- Given the form is submitted, when processing, then the URL input and button remain disabled until completion

### FR4. Error Handling and Display

**Description:** Error conditions are clearly communicated to users without navigation.

**Acceptance Criteria:**

- Given the server action returns an "Unsupported URL" error, when received, then the error message "Please enter a valid YouTube or Reddit URL" displays below the input field
- Given the server action returns an "Auth Unavailable" error, when received, then the error message "Analysis for this platform is temporarily unavailable. Please try again later" is displayed
- Given any server error occurs, when received, then the user remains on the analyze page without being redirected
- Given an error is displayed, when the user modifies the URL input, then the error message is cleared
- Given an error state exists, when displayed, then the error uses appropriate styling (red color, alert icon) for clear visibility

### FR5. Success Handling and Toast Notifications

**Description:** Successful submissions provide feedback through Mantine's notification system and redirect appropriately.

**Acceptance Criteria:**

- Given the server action completes successfully, when the response is received, then a toast notification using `notifications.show()` displays with success styling
- Given the success toast notification, when shown, then it remains visible for 2 seconds before auto-dismissing
- Given a successful analysis submission, when the toast notification appears, then the user is automatically redirected to `/dashboard` after 2 seconds
- Given the user returns to the dashboard, when the page loads, then the newly submitted analysis appears in the analysis list with "Processing..." status
- Given the URL input after successful submission, when cleared, then it resets to empty state before redirect

### FR6. Page Content and Messaging

**Description:** The page provides clear guidance and professional appearance.

**Acceptance Criteria:**

- Given the page loads, when displayed, then the page title (H1) reads "Analyze a New Post"
- Given the page content, when viewed, then instructional text states "Paste a URL from a supported platform to begin"
- Given the instructional text, when displayed, then it uses dimmed/secondary text styling for visual hierarchy
- Given the overall page design, when viewed, then it maintains consistency with other dashboard pages
- Given the card component, when displayed, then it includes appropriate padding, borders, and spacing for professional appearance

---

## 4. Technical Implementation Details

### 4.1. Navigation Updates

**Sidebar Navigation Enhancement:**

- Add "Analyse" link to the main navigation section in `SidebarNavigation.tsx`
- Import appropriate icon (suggest `IconSearch` or `IconAnalyze` from Tabler Icons)
- Position the link in the main navigation array alongside "Dashboard"

**Dashboard Button Placement:**

- Add "+ Analyze New Post" button in the top right corner of the dashboard content area
- Use Mantine's Button component with appropriate styling to match the dashboard theme
- Position using CSS Grid or Flexbox to ensure responsive behavior

### 4.2. Server Action Integration

**Existing Infrastructure:**

- Reuse `startAnalysis` server action from `apps/web/actions/analysis.actions.ts` without modifications
- Leverage existing `AnalyzeButton` component patterns from `apps/web/components/atoms/AnalyzeButton.tsx`
- Maintain current URL validation logic and error handling patterns

**Dependencies:**

- `urlParserService` for provider detection (YouTube, Reddit)
- Current authentication system and user session management
- Existing task and integration services in `packages/services` layer

### 4.3. Toast Notification Implementation

**Mantine Notifications System:**

- Use `import { notifications } from "@mantine/notifications"` for success/error messaging
- Success notification: `{ title: "Analysis Started", message: "Your analysis is being processed", color: "green" }`
- Error notifications: Use appropriate error colors and messages based on error type
- Auto-close timeout: 2000ms for success notifications, 5000ms for error notifications

### 4.4. Responsive Design Considerations

**Standard Best Practices:**

- Use Mantine's responsive props: `p={{ base: 12, sm: 16, md: 24 }}`
- Ensure card layout adapts to mobile viewports
- Maintain touch-friendly button sizes (minimum 44px touch targets)
- Test keyboard navigation and screen reader compatibility

---

## 5. Out of Scope (Non-Goals)

- **Multi-URL Batch Processing:** This feature will not support submitting multiple URLs simultaneously
- **Advanced URL Preview:** No URL preview, thumbnail fetching, or metadata display before submission
- **Custom Analysis Settings:** No options to configure analysis parameters (sentiment models, languages, etc.)
- **Scheduling Analysis:** No ability to schedule analysis for future execution
- **Integration Management:** No functionality to add/remove social media account integrations (handled elsewhere)
- **Historical Analysis Display:** The page will not show previous analysis results or history
- **Real-time Analysis Updates:** No live updates or progress indicators for analysis processing
- **Platform-Specific Features:** No specialized features for different social media platforms beyond URL validation
- **Export/Download Features:** No ability to export or download analysis results from this page
- **User Collaboration:** No sharing, commenting, or collaborative features for analysis requests
- **Analytics Tracking:** User interaction tracking will be implemented in a future iteration
- **Advanced Accessibility Features:** Standard WCAG compliance practices will be followed
- **Extended Browser Support:** Focus on modern browsers with standard JavaScript support
- **Load Testing Optimization:** Current queue system capacity is sufficient for expected usage

---

## 6. Success Metrics

- **Task Completion Rate:** 95% of users who reach the analyze page successfully submit a valid URL
- **Error Recovery Rate:** 80% of users who encounter validation errors successfully submit on their second attempt
- **User Flow Efficiency:** Average time from dashboard to successful analysis submission reduced to under 30 seconds
- **Navigation Usage:** Track adoption of both sidebar "Analyse" link and dashboard button for optimal placement insights

---

## 7. Implementation Priority

**Phase 1 (High Priority):**

1. Update sidebar navigation to include "Analyse" link
2. Create simplified card-based form interface
3. Integrate existing `startAnalysis` server action
4. Implement basic error handling and validation

**Phase 2 (Medium Priority):**

1. Add dashboard "+ Analyze New Post" button
2. Implement toast notification system
3. Add success redirect flow
4. Responsive design optimization

**Phase 3 (Low Priority):**

1. Polish visual design and animations
2. Accessibility audit and improvements
3. Performance optimization

---

## 8. Dependencies and Risks

**Technical Dependencies:**

- Mantine UI library components and notification system
- Existing authentication and session management
- Current server action infrastructure
- Prisma database client and services layer

**Potential Risks:**

- **Low Risk:** Server action performance under increased usage
- **Low Risk:** Browser compatibility with notification system
- **Medium Risk:** User confusion from navigation pattern changes (mitigated by maintaining existing analyse page route)

**Mitigation Strategies:**

- Gradual rollout with feature flags if needed
- Comprehensive testing across devices and browsers
- User feedback collection post-implementation
- Performance monitoring of server action usage patterns

---

_This PRD represents the final specification for the Analyse page refactor, incorporating all stakeholder feedback and technical validation. Implementation should proceed according to the priority phases outlined above._
