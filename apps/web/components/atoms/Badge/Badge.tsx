"use client";

import { Box } from "@mantine/core";
import { type ReactNode } from "react";
import classes from "./Badge.module.css";

interface BadgeProps {
  variant?: "filled" | "outline";
  colorScheme?: "primary" | "secondary";
  icon?: ReactNode;
  children: ReactNode;
}

export const Badge = ({
  variant = "filled",
  colorScheme = "primary",
  icon,
  children,
}: BadgeProps) => {
  const badgeClasses = [
    classes.badge,
    classes[variant],
    classes[colorScheme],
  ].join(" ");

  return (
    <Box className={badgeClasses}>
      {icon && <span className={classes.icon}>{icon}</span>}
      <span className={classes.text}>{children}</span>
    </Box>
  );
};

export default Badge;
