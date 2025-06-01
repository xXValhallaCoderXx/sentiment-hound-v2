"use client";

import { notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { useMantineTheme } from "@mantine/core"; // Import useMantineTheme

interface ErrorNotificationProps {
  error: {
    error: string;
    code: string;
    status: number;
  };
}

export function ErrorNotification({ error }: ErrorNotificationProps) {
  const theme = useMantineTheme(); // Get the theme object
  useEffect(() => {
    notifications.show({
      title: `Error ${error.status}`,
      message: error.error,
      // Use theme color for red, e.g., theme.colors.red[6]
      color: theme.colors.red[6],
      icon: <IconX />,
      autoClose: 5000,
    });
  }, [error, theme]); // Add theme to dependency array

  return null;
}
