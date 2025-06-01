import { FC } from "react";
// Import useMantineTheme
import { Alert, Button, Group, Text, useMantineTheme } from "@mantine/core";
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
  const theme = useMantineTheme(); // Get the theme object

  const icon =
    type === "success" ? (
      <IconCheck size={20} />
    ) : type === "warning" ? (
      <IconAlertTriangle size={20} />
    ) : (
      <IconInfoCircle size={20} /> // Default to info icon
    );

  // Use theme colors
  const color =
    type === "success"
      ? theme.colors.green[6] // Or theme.other.sentimentPositive if defined
      : type === "warning"
        ? theme.colors.yellow[6] // Or a specific warning color from theme
        : theme.colors.blue[6]; // Or a specific info color from theme

  return (
    <Alert
      icon={icon}
      title={<Text fw={600}>{title}</Text>}
      color={color} // Apply theme color
      radius="md"
      withCloseButton={false} // Assuming this is intentional, otherwise could be true
    >
      <Text mb="sm">{message}</Text>
      {buttonLabel && onClick && (
        <Group justify="start">
          {/* Button color can also be themed, e.g., theme.primaryColor or a specific theme.colors */}
          {/* For now, 'dark' is a valid Mantine color prop that respects theme */}
          <Button variant="filled" color="dark" size="xs" onClick={onClick}>
            {buttonLabel}
          </Button>
        </Group>
      )}
    </Alert>
  );
};

export default DashboardNotificationCard;
