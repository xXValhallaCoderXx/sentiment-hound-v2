"use client";

import React from "react";
import { Card, Text, Stack, Group, Divider } from "@mantine/core";
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
  /** User email address */
  userEmail?: string;
  /** User ID */
  userId?: string;
  /** User creation date */
  userCreatedAt?: Date;
}

const AccountManagementCard: React.FC<AccountManagementCardProps> = ({
  onDeleteAccount,
  isLoading = false,
  disabled = false,
  className,
  userEmail,
  userId,
  userCreatedAt,
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

        {/* Profile Section */}
        <Stack gap="md">
          <Text size="lg" fw={600}>
            Profile
          </Text>

          {/* Email Row */}
          {userEmail && (
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500}>
                Email
              </Text>
              <Text size="sm">{userEmail}</Text>
            </Group>
          )}

          {/* User ID Row */}
          {userId && (
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500}>
                User ID
              </Text>
              <Text size="sm">{userId}</Text>
            </Group>
          )}

          {/* Member Since Row */}
          {userCreatedAt && (
            <Group justify="space-between" align="center">
              <Text size="sm" fw={500}>
                Member Since
              </Text>
              <Text size="sm">
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(userCreatedAt)}
              </Text>
            </Group>
          )}
        </Stack>

        {/* Divider */}
        <Divider />

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
