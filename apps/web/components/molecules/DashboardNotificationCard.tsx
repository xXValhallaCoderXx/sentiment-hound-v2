import { FC } from "react";
import { Alert, Button, Group, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

type StatusType = "success" | "warning" | "info"; // Added "info" for completeness

interface IStatusAlertProps {
  type?: StatusType;
  title: string;
  message: string;
  buttonLabel?: string;
  onClick?: () => void;
}

const DashboardNotificationCard: FC<IStatusAlertProps> = ({
  type = "info", // Default to info if type is not provided
  title,
  message,
  buttonLabel,
  onClick,
}) => {
  const icon =
    type === "success" ? (
      <IconCheck size={20} />
    ) : type === "warning" ? (
      <IconAlertTriangle size={20} />
    ) : (
      <IconInfoCircle size={20} /> // Default to info icon
    );

  // Use semantic theme colors
  const color =
    type === "success" ? "success" : type === "warning" ? "warning" : "primary"; // Use primary for info

  return (
    <Alert
      icon={icon}
      title={<Text fw={600}>{title}</Text>}
      color={color} // Apply semantic theme color
      radius="md"
      withCloseButton={false} // Assuming this is intentional, otherwise could be true
    >
      <Text mb="sm">{message}</Text>
      {buttonLabel && onClick && (
        <Group justify="start">
          <Button
            variant="filled"
            color="secondary"
            size="xs"
            onClick={onClick}
          >
            {buttonLabel}
          </Button>
        </Group>
      )}
    </Alert>
  );
};

export default DashboardNotificationCard;
