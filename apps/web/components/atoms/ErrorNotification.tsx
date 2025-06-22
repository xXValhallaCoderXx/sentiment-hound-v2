"use client";

import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";

interface ErrorNotificationProps {
  error: {
    error: string;
    code: string;
    status: number;
  };
}

export function ErrorNotification({ error }: ErrorNotificationProps) {
  useEffect(() => {
    notifications.show({
      title: `Error ${error.status}`,
      message: error.error,
      color: "error",
      icon: <IconX />,
      autoClose: 5000,
    });
  }, [error]);

  return null;
}
