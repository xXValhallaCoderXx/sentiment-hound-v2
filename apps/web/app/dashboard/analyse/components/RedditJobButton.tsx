"use client";
import { FC, useState } from "react";
import { notifications } from "@mantine/notifications";
import { Button } from "@mantine/core";
import { addNewTask2 } from "@/slices/tasks/tasks.actions";
import { TaskType } from "@repo/db";

interface IRedditJobButtonProps {
  integration: string;
  userId: string;
}

const RedditJobButton: FC<IRedditJobButtonProps> = ({
  integration,
  userId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      await addNewTask2({
        type: TaskType.ANALYZE_POST,
        integrationId: integration,
        userId: userId,
      });
      notifications.show({
        title: "Success",
        message: "Reddit keyword search submitted successfully!",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error instanceof Error ? error.message : "An error occurred",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      type="button"
      w={{ base: '100%', sm: 200 }} // MODIFIED HERE
      onClick={handleSubmit}
      loading={isSubmitting}
      disabled={isSubmitting}
    >
      Search Reddit Keywords
    </Button>
  );
};

export default RedditJobButton;
