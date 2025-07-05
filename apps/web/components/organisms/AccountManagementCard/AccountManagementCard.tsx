"use client";

import React from "react";
import { Card, Text, Stack } from "@mantine/core";
import DangerZone from "../../molecules/DangerZone/DangerZone";
import classes from "./AccountManagementCard.module.css";

export interface AccountManagementCardProps {
  /** Callback when delete account action is triggered */
  onDeleteAccount: () => void;
  /** Whether any account actions are in progress */
  isLoading?: boolean;
  /** Whether account management actions are disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

const AccountManagementCard: React.FC<AccountManagementCardProps> = ({
  onDeleteAccount,
  isLoading = false,
  disabled = false,
  className,
}) => {
  return (
    <Card
      className={`${classes.card} ${className || ""}`}
      padding="lg"
      radius="md"
      withBorder
    >
      <Stack gap="lg">
        {/* Header */}
        <Text size="lg" fw={600}>
          Account Management
        </Text>

        {/* Future account management features could go here */}
        {/* For now, we only have the danger zone */}

        {/* Danger Zone - positioned at bottom with margin-top for generous spacing */}
        <div className={classes.dangerZoneContainer}>
          <DangerZone
            onDeleteAccount={onDeleteAccount}
            isLoading={isLoading}
            disabled={disabled}
          />
        </div>
      </Stack>
    </Card>
  );
};

export default AccountManagementCard;
