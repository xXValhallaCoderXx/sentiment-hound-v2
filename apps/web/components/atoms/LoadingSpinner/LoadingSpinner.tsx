import React from "react";
import { Loader, Center, Stack, Text } from "@mantine/core";

export interface LoadingSpinnerProps {
  message?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  centered?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Loading...",
  size = "md",
  centered = true,
}) => {
  const content = (
    <Stack align="center" gap="md">
      <Loader size={size} />
      {message && (
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      )}
    </Stack>
  );

  if (centered) {
    return <Center py="xl">{content}</Center>;
  }

  return content;
};

export default LoadingSpinner;
