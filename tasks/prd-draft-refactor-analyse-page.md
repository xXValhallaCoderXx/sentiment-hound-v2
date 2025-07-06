# PRD: Refactor "Analyse" Page for New Submissions - DRAFT

**Document ID:** SH-PRD-021  
**Author:** Architect  
**Status:** DRAFT  
**Date:** July 06, 2025  
**Target Route:** `/app/dashboard/analyse`

---

## 1. Overview

This feature refactors the existing `/app/dashboard/analyse` page to serve as a dedicated, focused interface for users to submit new post URLs for sentiment analysis. The refactor transforms this page from a complex multi-provider integration interface into a streamlined single-card form optimized for quick URL submission and analysis initiation. This replaces the previously planned modal dialog approach with a dedicated page flow, providing better user experience and clearer navigation patterns.

The primary goal is to create a frictionless entry point for users to start new sentiment analysis tasks while maintaining the robust error handling and success flows already established by the existing `startAnalysis` server action and `AnalyzeButton` component.

---

## 2. Assumptions Made

- The existing `startAnalysis` server action in `apps/web/actions/analysis.actions.ts` will continue to be used without modification
- The current `AnalyzeButton` component already provides the necessary functionality and can be reused in a card layout
- Users will navigate to this page via a "+ Analyze New Post" button from the "My Analyses" dashboard (route `/dashboard`)
- The App Shell (persistent sidebar and top header) should remain consistent with other dashboard pages
- The existing error handling and success messaging patterns are sufficient for user feedback
- The platform currently supports YouTube and Reddit URLs as indicated by the existing `AnalyzeButton` component
- Successful analysis submission should redirect users back to the main dashboard where they can see the new analysis in a "Processing" state
- The current permission and authentication system is sufficient (no additional access controls needed)
- The existing YoutubeUrlForm and RedditJobButton components on the current page will be completely replaced

---

## 3. User Stories

**Primary User Story:**

- As a **content creator or brand manager**, I want **to quickly submit a new social media URL for sentiment analysis** so that **I can monitor public opinion about my content or brand**.

**Supporting User Stories:**

- As a **user on the main dashboard**, I want **to click a prominent "+ Analyze New Post" button** so that **I can easily start a new analysis without searching through menus**.
- As a **user submitting a URL**, I want **immediate validation feedback** so that **I know if my URL is valid before submitting**.
- As a **user with a successful submission**, I want **to be automatically redirected back to my dashboard** so that **I can see my new analysis appear in the list**.
- As a **user who encounters an error**, I want **clear error messages displayed on the same page** so that **I can correct the issue without losing my current context**.
- As a **mobile user**, I want **the analysis submission page to work seamlessly on my device** so that **I can analyze content while on the go**.

---

## 4. Functional Requirements

### FR1. Page Navigation and Layout

**Description:** Users can navigate to the analyze page and see a clean, focused interface.

**Acceptance Criteria:**

- Given a user is on the main dashboard (`/dashboard`), when they click the "+ Analyze New Post" button, then they are navigated to `/app/dashboard/analyse`
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

### FR5. Success Handling and Redirection

**Description:** Successful submissions provide feedback and redirect appropriately.

**Acceptance Criteria:**

- Given the server action completes successfully, when the response is received, then a brief success message is shown (optional)
- Given a successful analysis submission, when completed, then the user is automatically redirected to `/dashboard`
- Given the user returns to the dashboard, when the page loads, then the newly submitted analysis appears in the analysis list with "Processing..." status
- Given the redirection occurs, when navigating, then it happens within 2 seconds of successful submission
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

---

## 6. Technical Considerations

**Integration Points:**

- Must reuse existing `startAnalysis` server action from `apps/web/actions/analysis.actions.ts`
- Should leverage the existing `AnalyzeButton` component from `apps/web/components/atoms/AnalyzeButton.tsx`
- Needs to integrate with the App Shell layout system in `apps/web/components/templates/DashboardLayout/`

**Dependencies:**

- Requires the existing URL parser service (`urlParserService`) for provider detection
- Depends on the current authentication system and user session management
- Relies on the existing task and integration services in the `packages/services` layer

**Performance Considerations:**

- Page should load quickly since it's a simple form interface
- Server action calls should maintain existing performance characteristics
- Redirection should be smooth and not jarring to user experience

**Security Considerations:**

- Must maintain existing authentication requirements (only authenticated users)
- Should preserve existing URL validation and sanitization
- No additional security measures required beyond current implementation

---

## 7. Success Metrics

- **Task Completion Rate:** 95% of users who reach the analyze page successfully submit a valid URL
- **Error Recovery Rate:** 80% of users who encounter validation errors successfully submit on their second attempt
- **User Flow Efficiency:** Average time from dashboard to successful analysis submission reduced to under 30 seconds

---

## 8. Open Questions

1. **Navigation Button Location:** Where exactly should the "+ Analyze New Post" button be placed on the main dashboard? Should it be in the header, as a floating action button, or within the main content area? We can have a button on the top right of dashboard content, as well as the Analyse link in the side navigation bar.

2. **Success Message Duration:** Should there be a success message shown before redirect, and if so, how long should it display before automatic redirect occurs? Can show some kind of toast notification, wait a couple seconds then redirect.

3. **Mobile Experience:** Are there any specific mobile-first considerations for the form layout beyond standard responsive design patterns? Just use standard best practices.

4. **Analytics Tracking:** Should user interactions on this page be tracked for analytics purposes (form submissions, error rates, etc.)? We don't have this yet.

5. **Accessibility Requirements:** Are there specific WCAG compliance levels or accessibility features that need to be implemented beyond standard practices? Standard practices.

6. **Browser Support:** What is the minimum browser support requirement for this feature, particularly regarding modern JavaScript features used in the existing codebase? We support most popular browsers.

7. **Load Testing:** What is the expected peak concurrent usage for this page, and does the existing `startAnalysis` server action handle the anticipated load? We dont need to think about this too much.

8. **URL Format Support:** Should the feature validate and support any additional URL formats beyond the currently supported YouTube and Reddit formats? This will be all for now.

9. **Error Message Customization:** Should error messages be configurable or translatable for different user locales/languages? We can work on this after.

10. **Integration with Task Queue:** How should the page handle scenarios where the task queue is full or experiencing high load? The queue system can still queue the task, there may just be delays with processing.
