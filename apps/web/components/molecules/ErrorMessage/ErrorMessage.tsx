import React from "react";
import { Alert, Center, Stack, Button } from "@mantine/core";
import { IconAlertCircle, IconRefresh } from "@tabler/icons-react";

export interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  centered?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Could not load your analyses. Please refresh the page.",
  onRetry,
  centered = true,
}) => {
  const content = (
    <Alert
      icon={<IconAlertCircle size={16} />}
      title="Error"
      color="red"
      variant="light"
    >
      <Stack gap="md">
        {message}
        {onRetry && (
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            size="sm"
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </Stack>
    </Alert>
  );

  if (centered) {
    return <Center py="xl">{content}</Center>;
  }

  return content;
};

export default ErrorMessage;
