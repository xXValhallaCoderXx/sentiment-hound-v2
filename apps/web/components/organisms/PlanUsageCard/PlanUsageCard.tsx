"use client";

import React from "react";
import {
  Card,
  Text,
  Badge,
  Stack,
  Group,
  Skeleton,
  Alert,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import TokenUsageProgress from "../../molecules/TokenUsageProgress/TokenUsageProgress";
import { PlanData, TokenUsage } from "../../../types";
import classes from "./PlanUsageCard.module.css";

export interface PlanUsageCardProps {
  /** Plan data */
  planData?: PlanData;
  /** Token usage data */
  tokenUsage?: TokenUsage;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  hasError?: boolean;
  /** Error message to display */
  errorMessage?: string;
  /** Whether to show detailed usage breakdown */
  showDetails?: boolean;
  /** Custom class name */
  className?: string;
}

const PlanUsageCard: React.FC<PlanUsageCardProps> = ({
  planData,
  tokenUsage,
  isLoading = false,
  hasError = false,
  errorMessage = "Unable to load plan and usage data",
  showDetails = true,
  className,
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Card
        className={`${classes.card} ${className || ""}`}
        padding="lg"
        radius="md"
        withBorder
      >
        <Stack gap="md">
          <Skeleton height={24} width="40%" />
          <Stack gap="xs">
            <Group justify="space-between">
              <Skeleton height={16} width="30%" />
              <Skeleton height={20} width="20%" />
            </Group>
            <Skeleton height={8} />
            <Stack gap="xs">
              <Group justify="space-between">
                <Skeleton height={12} width="25%" />
                <Skeleton height={12} width="35%" />
              </Group>
              <Group justify="space-between">
                <Skeleton height={12} width="20%" />
                <Skeleton height={12} width="30%" />
              </Group>
              <Group justify="space-between">
                <Skeleton height={12} width="18%" />
                <Skeleton height={12} width="28%" />
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    );
  }

  // Error state
  if (hasError) {
    return (
      <Card
        className={`${classes.card} ${className || ""}`}
        padding="lg"
        radius="md"
        withBorder
      >
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Plan & Usage
          </Text>
          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Error Loading Data"
            color="red"
            variant="light"
          >
            {errorMessage}
          </Alert>
        </Stack>
      </Card>
    );
  }

  // Default values if data is missing
  const currentPlan = planData?.name || "Developer";
  const currentUsage = tokenUsage?.current || 0;
  const totalTokens = tokenUsage?.limit || 10000;
  const periodEnd = tokenUsage?.periodEnd || null;

  return (
    <Card
      className={`${classes.card} ${className || ""}`}
      padding="lg"
      radius="md"
      withBorder
    >
      <Stack gap="md">
        {/* Header */}
        <Text size="lg" fw={600}>
          Plan & Usage
        </Text>

        {/* Current Plan Row */}
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            Current Plan
          </Text>
          <Badge
            variant="light"
            color={
              currentPlan.toLowerCase() === "developer"
                ? "blue"
                : currentPlan.toLowerCase() === "pro"
                  ? "green"
                  : "violet"
            }
            size="sm"
          >
            {currentPlan}
          </Badge>
        </Group>

        {/* Token Allowance Row */}
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            One-Time Token Allowance
          </Text>
          <Text size="sm">{totalTokens.toLocaleString()}</Text>
        </Group>

        {/* Tokens Used Row */}
        <Group justify="space-between" align="center">
          <Text size="sm" fw={500}>
            Tokens Used
          </Text>
          <Text size="sm">{currentUsage.toLocaleString()}</Text>
        </Group>

        {/* Token Usage Progress Bar */}
        <TokenUsageProgress
          totalTokens={totalTokens}
          usedTokens={currentUsage}
          periodEnd={periodEnd}
          showDetails={false}
          label=""
        />
      </Stack>
    </Card>
  );
};

export default PlanUsageCard;
