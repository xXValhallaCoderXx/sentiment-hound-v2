"use client";

import React from "react";
import { Progress, Text, Group, Stack, Box } from "@mantine/core";
import classes from "./TokenUsageProgress.module.css";

export interface TokenUsageProgressProps {
  /** Total tokens allowed */
  totalTokens: number;
  /** Tokens used in current period */
  usedTokens: number;
  /** End date of current billing period */
  periodEnd: Date | null;
  /** Custom color override */
  colorOverride?: "green" | "yellow" | "red" | "blue";
  /** Whether to show detailed breakdown */
  showDetails?: boolean;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  hasError?: boolean;
  /** Custom label for usage display */
  label?: string;
  /** Whether to show period end date */
  showPeriodEnd?: boolean;
}

const TokenUsageProgress: React.FC<TokenUsageProgressProps> = ({
  totalTokens,
  usedTokens,
  periodEnd,
  colorOverride,
  showDetails = true,
  isLoading = false,
  hasError = false,
  label = "Token Usage",
  showPeriodEnd = true,
}) => {
  // Calculate usage percentage
  const percentage = totalTokens > 0 ? (usedTokens / totalTokens) * 100 : 0;
  const remainingTokens = Math.max(0, totalTokens - usedTokens);
  const isOverage = usedTokens > totalTokens;

  // Determine color based on usage levels with color coding
  const getProgressColor = (): "green" | "yellow" | "red" | "blue" => {
    if (colorOverride) return colorOverride;
    if (isOverage) return "red";
    if (percentage >= 90) return "red";
    if (percentage >= 75) return "yellow";
    return "green";
  };

  // Format numbers for display
  const formatTokenCount = (tokens: number): string => {
    if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(1)}M`;
    if (tokens >= 1000) return `${(tokens / 1000).toFixed(0)}k`;
    return tokens.toLocaleString();
  };

  // Format period end date
  const formatPeriodEnd = (date: Date | null): string => {
    if (!date) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const progressColor = getProgressColor();

  if (isLoading) {
    return (
      <Box className={classes.container}>
        <Text size="sm" c="dimmed">
          Loading token usage...
        </Text>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box className={classes.container}>
        <Text size="sm" c="red">
          Unable to load token usage data
        </Text>
      </Box>
    );
  }

  return (
    <Stack gap="xs" className={classes.container}>
      {/* Header with usage summary */}
      <Group justify="space-between" wrap="nowrap">
        <Text size="sm" fw={500}>
          {label}
        </Text>
        <Text size="sm" c={isOverage ? "red" : "dimmed"}>
          {formatTokenCount(usedTokens)} / {formatTokenCount(totalTokens)}
          {isOverage && " (Over limit)"}
        </Text>
      </Group>

      {/* Progress bar */}
      <Progress
        value={Math.min(percentage, 100)}
        color={progressColor}
        size="md"
        radius="sm"
        className={classes.progress}
      />

      {/* Detailed breakdown */}
      {showDetails && (
        <Stack gap="xs">
          <Group justify="space-between" wrap="nowrap">
            <Text size="xs" c="dimmed">
              Remaining:
            </Text>
            <Text size="xs" c={remainingTokens > 0 ? "dimmed" : "red"}>
              {remainingTokens > 0
                ? `${formatTokenCount(remainingTokens)} tokens`
                : "No tokens remaining"}
            </Text>
          </Group>

          <Group justify="space-between" wrap="nowrap">
            <Text size="xs" c="dimmed">
              Usage:
            </Text>
            <Text size="xs" c={isOverage ? "red" : "dimmed"}>
              {percentage.toFixed(1)}%
              {isOverage && ` (+${(percentage - 100).toFixed(1)}% over)`}
            </Text>
          </Group>

          {/* Period end date */}
          {showPeriodEnd && periodEnd && (
            <Group justify="space-between" wrap="nowrap">
              <Text size="xs" c="dimmed">
                Resets:
              </Text>
              <Text size="xs" c="dimmed">
                {formatPeriodEnd(periodEnd)}
              </Text>
            </Group>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default TokenUsageProgress;
