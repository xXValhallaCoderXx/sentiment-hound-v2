"use client";

import React from "react";
import { Box, Button, Stack, Text, Divider } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import classes from "./DangerZone.module.css";

export interface DangerZoneProps {
  /** Callback when delete account button is clicked */
  onDeleteAccount: () => void;
  /** Whether the delete action is in progress */
  isLoading?: boolean;
  /** Whether the danger zone is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
}

const DangerZone: React.FC<DangerZoneProps> = ({
  onDeleteAccount,
  isLoading = false,
  disabled = false,
  className,
}) => {
  return (
    <Box className={`${classes.container} ${className || ""}`}>
      {/* Horizontal divider to separate from other content */}
      <Divider size="sm" color="red.3" className={classes.divider} />

      <Stack gap="md" className={classes.content}>
        {/* Danger Zone Header */}
        <Stack gap="xs">
          <Text size="sm" fw={600} c="red.7">
            Danger Zone
          </Text>
          <Text size="xs" c="dimmed">
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </Text>
        </Stack>

        {/* Delete Account Button */}
        <Button
          variant="outline"
          color="red"
          size="sm"
          leftSection={<IconTrash size={16} />}
          onClick={onDeleteAccount}
          loading={isLoading}
          disabled={disabled}
          className={classes.deleteButton}
        >
          Delete Account
        </Button>
      </Stack>
    </Box>
  );
};

export default DangerZone;
