"use client";

import { Box } from "@mantine/core";

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo = ({ size = 40, className }: LogoProps) => (
  <Box className={className}>
    {/* Using a simple circular logo placeholder - replace with actual logo */}
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2"/>
      <path 
        d="M12 20 L18 26 L28 14" 
        stroke="currentColor" 
        strokeWidth="3" 
        fill="none" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

export default Logo;
