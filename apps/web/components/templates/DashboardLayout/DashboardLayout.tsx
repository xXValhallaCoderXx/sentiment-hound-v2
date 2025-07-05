"use client";

import React from "react";
import {
  AppShell,
  AppShellHeader,
  AppShellNavbar,
  AppShellMain,
  Box,
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMediaQuery } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";
import { usePathname } from "next/navigation";
import { AuthenticatedNavigationMenu } from "../../organisms/AuthenticatedNavigationMenu";
import { OnboardingWrapper } from "../OnboardingWrapper";
import { InvitationTokenHandler } from "../../InvitationTokenHandler";
import SidebarNavigation from "../../organisms/SidebarNavigation/SidebarNavigation";
import LogoutConfirmationModal from "../../molecules/LogoutConfirmationModal/LogoutConfirmationModal";
import { logoutUser } from "../../../actions/account.actions";
import ErrorState from "../../molecules/ErrorState";
import ListLoadingSkeleton from "../../molecules/ListLoadingSkeleton";
import classes from "./DashboardLayout.module.css";

export interface DashboardLayoutProps {
  /** Content to be rendered in the main area */
  children: React.ReactNode;
  /** Optional sidebar component override */
  sidebarComponent?: React.ReactNode;
  /** Whether to hide the sidebar completely */
  hideSidebar?: boolean;
  /** Optional header component override */
  headerComponent?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Error state configuration */
  error?: {
    title?: string;
    message?: string;
    onRetry?: () => void;
  };
  /** Loading state configuration */
  loading?: {
    /** Show loading state */
    isLoading?: boolean;
    /** Number of skeleton items to display */
    itemCount?: number;
    /** Layout type for skeleton */
    layout?: "grid" | "list";
    /** Show page title skeleton */
    showTitle?: boolean;
    /** Show action button skeleton */
    showActionButton?: boolean;
  };
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebarComponent,
  hideSidebar = false,
  headerComponent,
  className,
  error,
  loading,
}) => {
  const [opened, { toggle, close }] = useDisclosure();
  const [
    logoutModalOpened,
    { open: openLogoutModal, close: closeLogoutModal },
  ] = useDisclosure();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const pathname = usePathname();

  // Auto-close mobile drawer on navigation
  React.useEffect(() => {
    if (isMobile && opened) {
      close();
    }
  }, [pathname, isMobile, opened, close]);

  // Handle logout confirmation
  const handleLogoutRequest = () => {
    openLogoutModal();
    // Close mobile menu if open
    if (isMobile) {
      close();
    }
  };

  // Handle confirmed logout
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      // Navigation will be handled by the auth system
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
      closeLogoutModal();
    }
  };

  return (
    <OnboardingWrapper>
      <InvitationTokenHandler />

      {/* Living Canvas Background */}
      <div className={classes.livingCanvasBackground}>
        <div className={classes.glow1}></div>
        <div className={classes.glow2}></div>
        <div className={classes.glow3}></div>
      </div>

      <AppShell
        header={{ height: 60 }}
        navbar={
          hideSidebar
            ? undefined
            : {
                width: 240,
                breakpoint: "lg", // 1024px breakpoint
                collapsed: { mobile: !opened, desktop: false },
              }
        }
        padding={0}
        withBorder={false}
        className={className}
      >
        <AppShellHeader withBorder>
          {headerComponent || (
            <AuthenticatedNavigationMenu isOpen={opened} onToggle={toggle} />
          )}
        </AppShellHeader>

        {!hideSidebar && (
          <>
            {/* Desktop Sidebar */}
            <AppShellNavbar p={0} withBorder={false}>
              <Box className={classes.sidebar}>
                {sidebarComponent || (
                  <SidebarNavigation
                    currentPath={pathname}
                    onLogoutClick={handleLogoutRequest}
                  />
                )}
              </Box>
            </AppShellNavbar>

            {/* Mobile Drawer */}
            <Drawer
              opened={Boolean(opened && isMobile)}
              onClose={close}
              size={240}
              padding={0}
              title=""
              withCloseButton={false}
              position="left"
            >
              <Box className={classes.sidebar}>
                {sidebarComponent || (
                  <SidebarNavigation
                    currentPath={pathname}
                    onLogoutClick={handleLogoutRequest}
                  />
                )}
              </Box>
            </Drawer>
          </>
        )}

        <AppShellMain className={classes.main}>
          <Box className={classes.content}>
            <Notifications position="top-right" />
            {error ? (
              <ErrorState
                title={error.title}
                message={error.message}
                onRetry={error.onRetry}
                showRetry={!!error.onRetry}
              />
            ) : loading?.isLoading ? (
              <ListLoadingSkeleton
                itemCount={loading.itemCount}
                layout={loading.layout}
                showTitle={loading.showTitle}
                showActionButton={loading.showActionButton}
              />
            ) : (
              children
            )}
          </Box>
        </AppShellMain>
      </AppShell>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        opened={logoutModalOpened}
        onConfirm={handleLogoutConfirm}
        onCancel={closeLogoutModal}
        isLoading={isLoggingOut}
      />
    </OnboardingWrapper>
  );
};

export default DashboardLayout;
