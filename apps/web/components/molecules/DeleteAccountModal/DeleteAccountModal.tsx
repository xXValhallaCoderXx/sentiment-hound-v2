"use client";

import React from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  Stack,
  Alert,
  TextInput,
} from "@mantine/core";
import { IconTrash, IconAlertTriangle } from "@tabler/icons-react";

export interface DeleteAccountModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Callback when account deletion is confirmed */
  onConfirm: () => void;
  /** Callback when modal is cancelled or closed */
  onCancel: () => void;
  /** Whether delete action is in progress */
  isLoading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  opened,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  const [confirmationText, setConfirmationText] = React.useState("");
  const requiredText = "DELETE MY ACCOUNT";
  const isConfirmationValid = confirmationText === requiredText;

  // Reset confirmation text when modal opens/closes
  React.useEffect(() => {
    if (!opened) {
      setConfirmationText("");
    }
  }, [opened]);

  const handleConfirm = () => {
    if (isConfirmationValid && !isLoading) {
      onConfirm();
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Delete Account"
      centered
      size="md"
      closeOnClickOutside={!isLoading}
      closeOnEscape={!isLoading}
      withCloseButton={!isLoading}
    >
      <Stack gap="md">
        {/* Warning Alert */}
        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Permanent Action"
          color="red"
          variant="light"
        >
          This action cannot be undone. Your account and all associated data
          will be permanently deleted.
        </Alert>

        {/* Detailed explanation */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            What will be deleted:
          </Text>
          <Text
            size="sm"
            c="dimmed"
            component="ul"
            style={{ margin: 0, paddingLeft: "1.2rem" }}
          >
            <li>Your user account and profile</li>
            <li>All connected data sources and integrations</li>
            <li>Historical sentiment analysis data</li>
            <li>Saved keywords and tracking configurations</li>
            <li>All dashboard reports and insights</li>
          </Text>
        </Stack>

        {/* Confirmation input */}
        <Stack gap="xs">
          <Text size="sm" fw={500}>
            To confirm deletion, type &ldquo;{requiredText}&rdquo; below:
          </Text>
          <TextInput
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={requiredText}
            error={
              confirmationText && !isConfirmationValid
                ? "Text does not match"
                : undefined
            }
            disabled={isLoading}
          />
        </Stack>

        {/* Action buttons */}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            color="red"
            variant="filled"
            leftSection={<IconTrash size={16} />}
            onClick={handleConfirm}
            loading={isLoading}
            disabled={!isConfirmationValid}
          >
            Delete Account
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteAccountModal;
