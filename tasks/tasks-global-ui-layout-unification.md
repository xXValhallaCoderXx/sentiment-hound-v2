## Relevant Files

- `/apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx` - Remove duplicate logout modal implementation
- `/apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.tsx` - Update button color to use primary theme color
- `/apps/web/components/templates/DashboardLayout/DashboardLayout.module.css` - Add Living Canvas background integration
- `/apps/web/components/templates/DashboardLayout/DashboardLayout.tsx` - Add error boundary and loading state integration
- `/apps/web/app/dashboard/competitors/page.tsx` - Remove PageLayout wrapper
- `/apps/web/app/dashboard/integrations/page.tsx` - Remove PageLayout wrapper
- `/apps/web/app/dashboard/posts/page.tsx` - Remove PageLayout wrapper
- `/apps/web/app/dashboard/jobs/page.tsx` - Remove PageLayout wrapper
- `/apps/web/components/templates/PageLayout.tsx` - May need deprecation documentation
- `/apps/web/components/molecules/NavigationLink/NavigationLink.tsx` - Verify active state management
- `/apps/web/app/dashboard/layout.tsx` - Verify DashboardLayout integration

### Notes

- All changes must maintain backward compatibility with existing authenticated routes
- Follow the existing CSS modules pattern and Mantine theme variables
- Use existing error handling and loading state components (`ErrorState`, `ListLoadingSkeleton`)
- Mobile drawer should auto-close on navigation (existing breakpoint: 1024px)
- Content max-width constraint: 1280px (already implemented in DashboardLayout.module.css)
- Run tests after each major change: `pnpm test`
- Test responsive behavior at 1024px breakpoint

## Tasks

- [x] 1.0 **PHASE 1 (Critical): Remove Duplicate Logout Modal**

  - [x] 1.1 Open `/apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx`
  - [x] 1.2 Locate the logout modal implementation (Modal component with logout confirmation)
  - [x] 1.3 Remove the entire Modal component and its related state (showLogoutModal, setShowLogoutModal)
  - [x] 1.4 Remove the handleLogoutConfirm function that calls signOut directly
  - [x] 1.5 Modify handleLogoutClick to only call onLogoutClick prop (remove showLogoutConfirmation logic)
  - [x] 1.6 Update the SidebarNavigationProps interface to remove showLogoutConfirmation prop
  - [x] 1.7 Test that clicking logout now only triggers the DashboardLayout modal

- [x] 2.0 **PHASE 1 (Critical): Update Logout Modal Styling**

  - [x] 2.1 Open `/apps/web/components/molecules/LogoutConfirmationModal/LogoutConfirmationModal.tsx`
  - [x] 2.2 Locate the Button component for the logout action
  - [x] 2.3 Change `color="blue"` to `color="primary"` to use the red theme color
  - [x] 2.4 Verify the change uses the primary red color defined in `/apps/web/lib/theme.ts`
  - [x] 2.5 Test the modal appearance to ensure red styling is applied correctly- [x] 3.0 **PHASE 1 (Critical): Verify Dashboard Layout Integration**

  - [x] 3.1 Open `/apps/web/app/dashboard/layout.tsx`
  - [x] 3.2 Confirm it imports and uses DashboardLayout component
  - [x] 3.3 Verify all routes under /dashboard inherit this layout automatically
  - [x] 3.4 Test that navigation and logout modal work correctly on all dashboard pages

- [x] 4.0 **PHASE 2 (Important): Integrate Living Canvas Background**

  - [x] 4.1 Open `/apps/web/app/(landing-page)/LandingPage.module.css`
  - [x] 4.2 Copy the Living Canvas background styles (.livingCanvasBackground, .glow1, .glow2, .glow3)
  - [x] 4.3 Open `/apps/web/components/templates/DashboardLayout/DashboardLayout.module.css`
  - [x] 4.4 Add the copied Living Canvas styles, adapting positioning for dashboard layout
  - [x] 4.5 Open `/apps/web/components/templates/DashboardLayout/DashboardLayout.tsx`
  - [x] 4.6 Add the Living Canvas background div with appropriate CSS classes in the component JSX
  - [x] 4.7 Ensure the background appears behind the sidebar and main content
  - [x] 4.8 Test visual consistency with landing pages

- [x] 5.0 **PHASE 2 (Important): Add Error Boundary Integration**

  - [x] 5.1 Open `/apps/web/components/templates/DashboardLayout/DashboardLayout.tsx`
  - [x] 5.2 Import the ErrorState component from `/apps/web/components/molecules/ErrorState`
  - [x] 5.3 Add error prop to DashboardLayoutProps interface for error state configuration
  - [x] 5.4 Update main content area to conditionally render ErrorState component
  - [x] 5.5 Support for error title, message, and retry functionality
  - [x] 5.6 Test error boundary integration works correctly

- [x] 6.0 **PHASE 2 (Important): Add Loading State Integration**

  - [x] 6.1 Open `/apps/web/components/templates/DashboardLayout/DashboardLayout.tsx`
  - [x] 6.2 Import ListLoadingSkeleton from `/apps/web/components/molecules/ListLoadingSkeleton`
  - [x] 6.3 Add optional loading prop to DashboardLayoutProps interface
  - [x] 6.4 Conditionally render ListLoadingSkeleton when loading prop is true
  - [x] 6.5 Support for itemCount, layout type, showTitle, and showActionButton options
  - [x] 6.6 Test loading states appear correctly during content loading

- [x] 7.0 **PHASE 3 (Enhancement): Remove PageLayout from Competitors Page**

  - [x] 7.1 Open `/apps/web/app/dashboard/competitors/page.tsx`
  - [x] 7.2 Remove the import statement for PageLayout
  - [x] 7.3 Remove all PageLayout wrapper components from the JSX
  - [x] 7.4 Move the title and description to page-level heading components (Title and Text)
  - [x] 7.5 Adjust the Box padding to match other dashboard pages (p={{ base: 12, sm: 16, md: 24 }})
  - [x] 7.6 Test that the page renders correctly within DashboardLayout
  - [x] 7.7 Verify mobile responsive behavior

- [x] 8.0 **PHASE 3 (Enhancement): Remove PageLayout from Integrations Page**

  - [x] 8.1 Open `/apps/web/app/dashboard/integrations/page.tsx`
  - [x] 8.2 Remove the import statement for PageLayout
  - [x] 8.3 Remove all PageLayout wrapper components from the JSX
  - [x] 8.4 Move the title and description to page-level heading components
  - [x] 8.5 Adjust the Box padding to match other dashboard pages
  - [x] 8.6 Test that the page renders correctly within DashboardLayout
  - [x] 8.7 Verify the integrations functionality still works

- [x] 9.0 **PHASE 3 (Enhancement): Remove PageLayout from Posts Page**

  - [x] 9.1 Open `/apps/web/app/dashboard/posts/page.tsx`
  - [x] 9.2 Remove the import statement for PageLayout
  - [x] 9.3 Remove all PageLayout wrapper components from the JSX
  - [x] 9.4 Move the title and description to page-level heading components
  - [x] 9.5 Adjust the Box padding to match other dashboard pages
  - [x] 9.6 Test that the page renders correctly within DashboardLayout
  - [x] 9.7 Verify posts list and search functionality work correctly

- [x] 10.0 **PHASE 3 (Enhancement): Remove PageLayout from Jobs Page**

  - [x] 10.1 Open `/apps/web/app/dashboard/jobs/page.tsx`
  - [x] 10.2 Remove the import statement for PageLayout
  - [x] 10.3 Remove all PageLayout wrapper components from the JSX
  - [x] 10.4 Move the title and description to page-level heading components
  - [x] 10.5 Adjust the Box padding to match other dashboard pages
  - [x] 10.6 Test that the page renders correctly within DashboardLayout
  - [x] 10.7 Verify jobs table and functionality work correctly

- [x] 11.0 **PHASE 3 (Enhancement): Verify Navigation State Management**

  - [x] 11.1 Open `/apps/web/components/molecules/NavigationLink/NavigationLink.tsx`
  - [x] 11.2 Verify it uses isActive prop passed from parent components
  - [x] 11.3 Test active navigation highlighting works correctly across all pages
  - [x] 11.4 Verify navigation state synchronization when navigating between pages
  - [x] 11.5 Test mobile drawer auto-close behavior on navigation
  - [x] 11.6 Ensure consistent navigation behavior on all dashboard routes

- [x] 12.0 **PHASE 3 (Enhancement): Mobile Drawer Auto-Close**

  - [x] 12.1 Open `/apps/web/components/templates/DashboardLayout/DashboardLayout.tsx`
  - [x] 12.2 Locate the navigation handling logic in the mobile drawer
  - [x] 12.3 Add useEffect to listen for pathname changes
  - [x] 12.4 Call the close() function when pathname changes and mobile drawer is open
  - [x] 12.5 Test that mobile drawer closes automatically when navigating
  - [x] 12.6 Verify this only happens on mobile devices (isMobile condition)

- [x] 13.0 **Final Testing and Validation**
  - [x] 13.1 Test all dashboard pages load correctly with unified layout
  - [x] 13.2 Verify no duplicate logout modals appear anywhere
  - [x] 13.3 Confirm logout modal uses red primary color
  - [x] 13.4 Test responsive behavior at 1024px breakpoint
  - [x] 13.5 Verify content max-width constraint (1280px) works on large screens
  - [x] 13.6 Test mobile drawer auto-close functionality
  - [x] 13.7 Verify Living Canvas background appears correctly
  - [x] 13.8 Test error boundary integration
  - [x] 13.9 Test loading states integration
  - [x] 13.10 Confirm navigation active states work correctly
  - [x] 13.11 Run full test suite: `pnpm test`
  - [x] 13.12 Test in multiple browsers and screen sizes
