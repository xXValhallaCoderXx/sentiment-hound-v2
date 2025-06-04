"use client";

import { useState } from "react";
import { Button, Select, Text } from "@mantine/core";
import { TaskType } from "@repo/db";

interface TaskFormProps {
  providerId: number;
}

const TaskForm = ({ providerId }: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<string>(TaskType.FULL_SYNC);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("providerId", providerId.toString());
      formData.append("taskType", taskType);

      // You can add any extra data needed for specific task types
      const extraData = JSON.stringify({});
      formData.append("extraData", extraData);

      //   await addNewTask(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Select
        value={taskType}
        onChange={(value) => setTaskType(value || TaskType.FULL_SYNC)}
        data={[
          { value: TaskType.FULL_SYNC, label: "Full Sync" },
          { value: TaskType.PARTIAL_SYNC, label: "Partial Sync" },
          { value: TaskType.FETCH_CONTENT, label: "Analysis" },
        ]}
        style={{ minWidth: 120 }}
        mr="sm"
      />

      {error && (
        <Text color="red" size="sm">
          {error}
        </Text>
      )}

      <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
        Run Task
      </Button>
    </form>
  );
};

export default TaskForm;
