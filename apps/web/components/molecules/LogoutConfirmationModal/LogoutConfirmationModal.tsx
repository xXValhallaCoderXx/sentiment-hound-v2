"use client";

import React from "react";
import { Modal, Text, Button, Group, Stack } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";

export interface LogoutConfirmationModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Callback when logout is confirmed */
  onConfirm: () => void;
  /** Callback when modal is cancelled or closed */
  onCancel: () => void;
  /** Whether logout action is in progress */
  isLoading?: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  opened,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Confirm Logout"
      centered
      size="sm"
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
    >
      <Stack gap="md">
        {/* Confirmation message */}
        <Text size="sm">
          Are you sure you want to log out? You will need to sign in again to
          access your dashboard.
        </Text>

        {/* Action buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="blue"
            leftSection={<IconLogout size={16} />}
            onClick={onConfirm}
            loading={isLoading}
          >
            Logout
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default LogoutConfirmationModal;
