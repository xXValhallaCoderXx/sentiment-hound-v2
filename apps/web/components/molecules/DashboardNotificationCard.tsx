import { FC } from "react";
import { Alert, Button, Group, Text } from "@mantine/core";
import {
  IconAlertTriangle,
  IconCheck,
  IconInfoCircle,
} from "@tabler/icons-react";

type StatusType = "success" | "warning";

interface IStatusAlertProps {
  type?: StatusType;
  title: string;
  message: string;
  buttonLabel?: string;
  onClick?: () => void;
}

const DashboardNotificationCard: FC<IStatusAlertProps> = ({
  type,
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
      <IconInfoCircle size={20} />
    );

  const color = type === "success" ? "green" : "yellow";

  return (
    <Alert
      icon={icon}
      title={<Text fw={600}>{title}</Text>}
      color={color}
      radius="md"
      withCloseButton={false}
    >
      <Text mb="sm">{message}</Text>
      {buttonLabel && onClick && (
        <Group justify="start">
          <Button variant="filled" color="dark" size="xs" onClick={onClick}>
            {buttonLabel}
          </Button>
        </Group>
      )}
    </Alert>
  );
};

export default DashboardNotificationCard;
