"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Box, Stack, Text } from "@mantine/core";
import {
  IconHome,
  IconSearch,
  IconSettings,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import NavigationLink from "../../molecules/NavigationLink/NavigationLink";
import classes from "./SidebarNavigation.module.css";

export interface SidebarNavigationProps {
  /** Current path for active state detection */
  currentPath?: string;
  /** Callback when logout is clicked */
  onLogoutClick?: () => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  currentPath,
  onLogoutClick,
}) => {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const handleLogoutClick = () => {
    onLogoutClick?.();
  };

  // Main navigation items
  const mainNavigation = [
    {
      href: "/dashboard",
      icon: IconHome,
      label: "Dashboard",
    },
    {
      href: "/dashboard/analyse",
      icon: IconSearch,
      label: "Analyse",
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
    <Box className={classes.sidebar}>
      <Stack gap={0} className={classes.navigationContainer}>
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
  );
};

export default SidebarNavigation;
