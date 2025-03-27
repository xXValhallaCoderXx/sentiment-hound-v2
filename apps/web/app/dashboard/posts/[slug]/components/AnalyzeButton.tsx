"use client";

import React, { useState } from "react";
import { Button } from "@mantine/core";
import { IconBrightness } from "@tabler/icons-react";
import { analyzeYoutubePosts } from "@/actions/youtube.actions";
import { notifications } from "@mantine/notifications";

interface AnalyzeButtonProps {
  name: string;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ name }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (name !== "youtube") return; // Only handle YouTube for now

    setIsLoading(true);
    try {
      const response = await analyzeYoutubePosts();

      if (response.error) {
        notifications.show({
          title: "Error",
          message: response.error.error,
          color: "red",
        });
      } else {
        notifications.show({
          title: "Success",
          message: "YouTube posts analyzed successfully",
          color: "green",
        });
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to analyze posts",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAnalyze}
      loading={isLoading}
      leftSection={<IconBrightness size={16} />}
      variant="light"
      color="green"
    >
      Analyze
    </Button>
  );
};

export default AnalyzeButton;
