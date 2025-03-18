"use client";

import React, { useState } from "react";
import { Button } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { refreshAccessToken } from "@/actions/youtube.actions";
import { notifications } from "@mantine/notifications";

interface RefreshButtonProps {
  name: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ name }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    if (name !== "youtube") return; // Only handle YouTube for now

    setIsLoading(true);
    try {
      const response = await refreshAccessToken();

      // if (response.error) {
      //   notifications.show({
      //     title: "Error",
      //     message: response.error.error,
      //     color: "red",
      //   });
      // } else {
      //   notifications.show({
      //     title: "Success",
      //     message: "YouTube posts refreshed successfully",
      //     color: "green",
      //   });
      // }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to refresh posts",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      loading={isLoading}
      leftSection={<IconRefresh size={16} />}
      variant="light"
      color="blue"
    >
      Refresh
    </Button>
  );
};

export default RefreshButton;
