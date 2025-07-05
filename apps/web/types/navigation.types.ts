// Types for navigation system
import { ReactNode } from "react";

export interface NavigationItem {
  /** Unique identifier for the navigation item */
  id: string;
  /** Display label for the navigation item */
  label: string;
  /** Navigation href or route */
  href: string;
  /** Icon component for the navigation item */
  icon: ReactNode;
  /** Whether this item requires authentication */
  requiresAuth?: boolean;
  /** Optional click handler for custom behavior */
  onClick?: () => void;
  /** Whether this navigation item is disabled */
  disabled?: boolean;
  /** Optional badge or indicator content */
  badge?: ReactNode;
}

export interface NavigationGroup {
  /** Group identifier */
  id: string;
  /** Group display name */
  title: string;
  /** Navigation items in this group */
  items: NavigationItem[];
}

export interface NavigationState {
  /** Currently active navigation item id */
  activeItemId: string | null;
  /** Current route path */
  currentPath: string;
  /** Whether navigation is in loading state */
  isLoading: boolean;
  /** Whether mobile navigation is open */
  isMobileOpen: boolean;
}

export interface SidebarProps {
  /** Current navigation state */
  navigationState: NavigationState;
  /** Navigation groups to display */
  navigationGroups: NavigationGroup[];
  /** Callback when navigation item is clicked */
  onNavigationClick: (item: NavigationItem) => void;
  /** Callback when mobile navigation state changes */
  onMobileToggle: (isOpen: boolean) => void;
  /** Whether sidebar should be collapsed */
  collapsed?: boolean;
  /** Optional logo component */
  logo?: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
}
