"use client";

import React from "react";
import Link from "next/link";
import { UnstyledButton, Group, Text, Box } from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import classes from "./NavigationLink.module.css";

export interface NavigationLinkProps {
  /** Navigation href or route */
  href: string;
  /** Icon component */
  icon: React.ComponentType<IconProps>;
  /** Display label */
  label: string;
  /** Whether this link is currently active */
  isActive?: boolean;
  /** Optional click handler for custom behavior */
  onClick?: () => void;
  /** Whether this link is disabled */
  disabled?: boolean;
  /** Optional badge or indicator content */
  badge?: React.ReactNode;
  /** Custom CSS class */
  className?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({
  href,
  icon: Icon,
  label,
  isActive = false,
  onClick,
  disabled = false,
  badge,
  className,
}) => {
  const linkContent = (
    <UnstyledButton
      className={`${classes.link} ${isActive ? classes.active : ""} ${disabled ? classes.disabled : ""} ${className || ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Group wrap="nowrap" align="center" gap="sm">
        <Box className={classes.iconWrapper}>
          <Icon size={18} className={classes.icon} />
        </Box>
        <Text className={classes.label} size="sm" fw={500}>
          {label}
        </Text>
        {badge && <Box className={classes.badge}>{badge}</Box>}
      </Group>
    </UnstyledButton>
  );

  if (disabled || onClick) {
    return linkContent;
  }

  return (
    <Link href={href} className={classes.linkWrapper}>
      {linkContent}
    </Link>
  );
};

export default NavigationLink;
