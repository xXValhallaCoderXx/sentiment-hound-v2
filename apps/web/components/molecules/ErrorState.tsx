import { FC } from "react";
import { Flex, Title, Text, Button, Stack } from "@mantine/core";
import {
  IconAlertTriangle,
  IconWifiOff,
  IconRefresh,
  TablerIcon,
} from "@tabler/icons-react";

interface ErrorStateProps {
  /** Error title */
  title?: string;
  /** Error description message */
  message?: string;
  /** Icon to display */
  icon?: TablerIcon;
  /** Text for the retry button */
  retryText?: string;
  /** Function to call when retry button is clicked */
  onRetry?: () => void;
  /** Show retry button */
  showRetry?: boolean;
}

const ErrorState: FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We couldn't load your data at this moment. Please check your connection and try again.",
  icon: IconComponent = IconAlertTriangle,
  retryText = "Try Again",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Flex direction="column" align="center" justify="center" gap="md" py="xl">
      <IconComponent
        size={64}
        color="var(--mantine-color-red-6)"
        opacity={0.7}
      />
      <Stack gap="xs" align="center">
        <Title order={3} ta="center">
          {title}
        </Title>
        <Text ta="center" c="dimmed" size="sm" maw={400}>
          {message}
        </Text>
      </Stack>
      {showRetry && onRetry && (
        <Button
          onClick={onRetry}
          leftSection={<IconRefresh size={16} />}
          variant="light"
          color="red"
          mt="md"
        >
          {retryText}
        </Button>
      )}
    </Flex>
  );
};

// Predefined error state variants for common scenarios
export const NetworkErrorState: FC<
  Omit<ErrorStateProps, "icon" | "title" | "message">
> = (props) => (
  <ErrorState
    {...props}
    icon={IconWifiOff}
    title="Connection Error"
    message="Unable to connect to the server. Please check your internet connection and try again."
  />
);

export const ServerErrorState: FC<
  Omit<ErrorStateProps, "icon" | "title" | "message">
> = (props) => (
  <ErrorState
    {...props}
    icon={IconAlertTriangle}
    title="Server Error"
    message="We're experiencing technical difficulties. Please try again in a few moments."
  />
);

export default ErrorState;
