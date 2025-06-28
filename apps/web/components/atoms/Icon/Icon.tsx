"use client";

import { ThemeIcon } from "@mantine/core";
import { type ReactElement } from "react";

interface IconProps {
  icon: ReactElement;
  size?: number;
  color?: string;
}

export const Icon = ({ icon, size = 24, color, ...props }: IconProps) => (
  <ThemeIcon size={size} variant="transparent" c={color} {...props}>
    {icon}
  </ThemeIcon>
);

export default Icon;
