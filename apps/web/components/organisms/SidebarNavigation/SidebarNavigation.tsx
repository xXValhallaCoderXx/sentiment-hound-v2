"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Box, Stack, Group, Text, Modal, Button } from "@mantine/core";
import {
  IconHome,
  IconSettings,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/atoms/Logo/Logo";
import NavigationLink from "../../molecules/NavigationLink/NavigationLink";
import classes from "./SidebarNavigation.module.css";

export interface SidebarNavigationProps {
  /** Current path for active state detection */
  currentPath?: string;
  /** Callback when logout is clicked */
  onLogoutClick?: () => void;
  /** Whether to show logout confirmation modal */
  showLogoutConfirmation?: boolean;
  /** Custom logo component */
  logo?: React.ReactNode;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentPath,
  onLogoutClick,
  showLogoutConfirmation = true,
  logo,
}) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    if (showLogoutConfirmation) {
      setShowLogoutModal(true);
    } else {
      handleLogoutConfirm();
    }
    onLogoutClick?.();
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await signOut();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  // Main navigation items
  const mainNavigation = [
    {
      href: "/dashboard",
      icon: IconHome,
      label: "Dashboard",
    },
  ];

  // Future feature - Source Management (disabled for now)
  const futureNavigation = [
    {
      href: "#",
      icon: IconSettings,
      label: "Source Management",
      disabled: true,
    },
  ];

  // Settings navigation group
  const settingsNavigation = [
    {
      href: "/dashboard/profile",
      icon: IconUser,
      label: "Profile",
    },
  ];

  return (
    <>
      <Box className={classes.sidebar}>
        <Stack gap={0} className={classes.navigationContainer}>
          {/* Logo Section */}
          <Box className={classes.logoSection}>
            {logo || <Logo size={40} showText={true} />}
          </Box>

          {/* Main Navigation */}
          <Box className={classes.navigationSection}>
            <Stack gap="xs">
              {mainNavigation.map((item) => (
                <NavigationLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={activePath === item.href}
                />
              ))}

              {/* Future navigation items */}
              {futureNavigation.map((item) => (
                <NavigationLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={false}
                  disabled={true}
                />
              ))}
            </Stack>
          </Box>

          {/* Settings Section */}
          <Box className={classes.navigationSection}>
            <Text size="xs" fw={500} c="dimmed" mb="xs" px="sm">
              SETTINGS
            </Text>
            <Stack gap="xs">
              {settingsNavigation.map((item) => (
                <NavigationLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={activePath === item.href}
                />
              ))}

              {/* Logout Link */}
              <NavigationLink
                href="#"
                icon={IconLogout}
                label="Logout"
                onClick={handleLogoutClick}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        opened={showLogoutModal}
        onClose={handleLogoutCancel}
        title="Confirm Logout"
        centered
      >
        <Text mb="md">Are you sure you want to logout?</Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={handleLogoutCancel}>
            Cancel
          </Button>
          <Button color="red" onClick={handleLogoutConfirm}>
            Logout
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default SidebarNavigation;
