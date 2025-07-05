# Development Tasks: Settings Page UI/UX Enhancement

## Relevant Files

### Components to Modify

- `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx` - Update sidebar branding with Logo component
- `apps/web/app/dashboard/profile/components/ProfileContent.tsx` - Add page header structure
- `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.tsx` - Restructure to row-based layout
- `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.tsx` - Add Profile section with user data

### CSS Module Files to Update

- `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.module.css` - Styling updates for logo integration
- `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.module.css` - Row-based layout styling
- `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.module.css` - Profile section styling

### Test Files to Create/Update

- `apps/web/components/organisms/SidebarNavigation/__tests__/SidebarNavigation.test.tsx` - Test logo integration
- `apps/web/app/dashboard/profile/components/__tests__/ProfileContent.test.tsx` - Test page header implementation
- `apps/web/components/organisms/PlanUsageCard/__tests__/PlanUsageCard.test.tsx` - Test row-based layout
- `apps/web/components/organisms/AccountManagementCard/__tests__/AccountManagementCard.test.tsx` - Test profile section

### Dependencies (Existing)

- `@/components/atoms/Logo/Logo.tsx` - Theme-aware logo component
- `@/components/atoms/Badge/Badge.tsx` - Reusable badge component
- `@/components/molecules/TokenUsageProgress/TokenUsageProgress.tsx` - Progress visualization
- Mantine UI components: `Title`, `Text`, `Group`, `Stack`, `Divider`, `Card`

### Notes

- All component modifications should maintain existing TypeScript interfaces and prop structures
- Follow functional component patterns with React hooks
- Use CSS modules for styling where needed
- Maintain existing responsive design patterns
- Run tests with `pnpm test` for the entire test suite or `pnpm test [file-path]` for specific files

## Tasks

- [x] **1.0 Sidebar Branding Update (FR1)**

  - [x] 1.1 Open `apps/web/components/organisms/SidebarNavigation/SidebarNavigation.tsx`
  - [x] 1.2 Add import statement for Logo component: `import { Logo } from "@/components/atoms/Logo/Logo"`
  - [x] 1.3 Locate the logoSection in the component (around line 90-95)
  - [x] 1.4 Replace the hardcoded Group/Text elements with `<Logo size={40} showText={true} />`
  - [x] 1.5 Remove the existing blue "Sentiment Hound" Text component and its styling
  - [x] 1.6 Test the logo renders correctly in both light and dark themes
  - [x] 1.7 Verify the logo maintains consistent sizing across all dashboard pages

- [x] **2.0 Settings Page Header Implementation (FR2)**

  - [x] 2.1 Open `apps/web/app/dashboard/profile/components/ProfileContent.tsx`
  - [x] 2.2 Add Mantine imports: `import { Stack, Title, Text } from "@mantine/core"`
  - [x] 2.3 Locate the main return statement with the existing Stack component
  - [x] 2.4 Add a header section above the existing Stack with gap="xl"
  - [x] 2.5 Create the page title: `<Title order={1} fw={700}>Settings</Title>`
  - [x] 2.6 Add the subtitle: `<Text c="dimmed" size="md">Manage your plan, usage, and account settings</Text>`
  - [x] 2.7 Wrap the header in a Stack with gap="xs" for proper spacing
  - [x] 2.8 Test the header appears above all cards with proper typography hierarchy
  - [x] 2.9 Verify responsive behavior on mobile devices (text should remain readable)

- [x] **3.0 Plan & Usage Card Layout Restructure (FR3)**

  - [x] 3.1 Open `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.tsx`
  - [x] 3.2 Add Mantine Group import: `import { Card, Text, Badge, Stack, Group, Skeleton, Alert } from "@mantine/core"`
  - [x] 3.3 Locate the main content section (around line 110-140) with current plan display
  - [x] 3.4 Replace the current plan section with a Group component for left-right alignment
  - [x] 3.5 Create "Current Plan:" label on the left and Badge component on the right
  - [x] 3.6 Add Token Allowance row: "One-Time Token Allowance" label with value on the right
  - [x] 3.7 Add Tokens Used row: "Tokens Used" label with current usage value on the right
  - [x] 3.8 Move the TokenUsageProgress component below the information rows
  - [x] 3.9 Ensure all rows use Group with justify="space-between" for consistent alignment
  - [x] 3.10 Test the row-based layout displays correctly with left-aligned labels and right-aligned values
  - [x] 3.11 Verify the Badge component integration maintains existing color scheme
  - [x] 3.12 Confirm TokenUsageProgress component continues to function with primary accent color

- [x] **4.0 Account Management Card Profile Section (FR4)**

  - [x] 4.1 Open `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.tsx`
  - [x] 4.2 Add Mantine imports: `import { Card, Text, Stack, Group, Divider } from "@mantine/core"`
  - [x] 4.3 Update the component interface to accept user data props:
    ```typescript
    interface AccountManagementCardProps {
      onDeleteAccount: () => void;
      isLoading?: boolean;
      disabled?: boolean;
      className?: string;
      userEmail?: string;
      userId?: string;
      userCreatedAt?: Date;
    }
    ```
  - [x] 4.4 Add the new props to the component parameters with default values
  - [x] 4.5 Create a Profile section above the existing content using Stack component
  - [x] 4.6 Add "Profile" sub-heading: `<Text size="lg" fw={600}>Profile</Text>`
  - [x] 4.7 Create email row with Group: "Email" label on left, userEmail value on right
  - [x] 4.8 Add conditional user ID row if userId exists: "User ID" label with value
  - [x] 4.9 Add conditional creation date row if userCreatedAt exists: "Member Since" with formatted date
  - [x] 4.10 Add Mantine Divider component between Profile section and existing Danger Zone
  - [x] 4.11 Test the Profile section displays above Danger Zone with proper visual separation
  - [x] 4.12 Verify all user information fields follow the left-label, right-value pattern

- [x] **5.0 Update Parent Component Data Flow**

  - [x] 5.1 Open `apps/web/app/dashboard/profile/components/ProfileContent.tsx`
  - [x] 5.2 Add session import if not already present: `import { useSession } from "next-auth/react"`
  - [x] 5.3 Access user data from the session or props passed from page.tsx
  - [x] 5.4 Pass user data props to AccountManagementCard component:
    ```typescript
    <AccountManagementCard
      onDeleteAccount={handleDeleteAccountRequest}
      isLoading={isDeleting}
      disabled={false}
      userEmail={session?.user?.email}
      userId={session?.user?.id}
    />
    ```
  - [x] 5.5 Test the data flows correctly from parent to AccountManagementCard

- [x] **6.0 CSS Modules Styling Updates**

  - [x] 6.1 Open `apps/web/components/organisms/PlanUsageCard/PlanUsageCard.module.css`
  - [x] 6.2 Add styles for row-based layout if needed (Group components should handle most styling)
  - [x] 6.3 Ensure hover states work correctly with the new layout
  - [x] 6.4 Open `apps/web/components/organisms/AccountManagementCard/AccountManagementCard.module.css`
  - [x] 6.5 Add styles for Profile section spacing and layout if needed
  - [x] 6.6 Ensure Divider component has proper margins for visual separation

- [x] **7.0 Cross-browser and Responsive Testing**

  - [x] 7.1 Test all components in Chrome, Firefox, Safari, and Edge
  - [x] 7.2 Verify responsive behavior on mobile devices (320px to 768px)
  - [x] 7.3 Test tablet layouts (768px to 1024px)
  - [x] 7.4 Confirm desktop layouts work correctly (1024px and above)
  - [x] 7.5 Test dark mode and light mode theme compatibility
  - [x] 7.6 Verify accessibility compliance (proper heading hierarchy, contrast ratios)

- [x] **8.0 Final Integration and Quality Assurance**
  - [x] 8.1 Run the full test suite: `pnpm test`
  - [x] 8.2 Run TypeScript type checking: `pnpm type-check`
  - [x] 8.3 Test the complete user flow from login to settings page
  - [x] 8.4 Verify all acceptance criteria from the PRD are met
  - [x] 8.5 Test with different user types (users with/without plan data)
  - [x] 8.6 Confirm no breaking changes to existing functionality
  - [x] 8.7 Document any component prop changes for future reference
