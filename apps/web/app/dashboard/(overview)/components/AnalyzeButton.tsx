"use client";

import React from "react";
import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./AnalyzeButton.module.css";

export interface AnalyzeButtonProps {
  /** Optional class name for styling */
  className?: string;
  /** Button size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Button variant */
  variant?: "filled" | "outline" | "light" | "subtle" | "default";
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  className,
  size = "md",
  variant = "filled",
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard/analyse");
  };

  return (
    <Button
      leftSection={<IconPlus size={16} />}
      onClick={handleClick}
      size={size}
      variant={variant}
      className={`${classes.analyzeButton} ${className || ''}`}
    >
      Analyze New Post
    </Button>
  );
};

export default AnalyzeButton;
