"use client";

import { useState } from "react";
import { Button, Select, Text, Group, Stack } from "@mantine/core";
import { TaskType } from "@repo/db";

interface TaskFormProps {
  providerId: number;
}

const TaskForm = ({ providerId }: TaskFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<string>(TaskType.FULL_SYNC);
  const [exportDataType, setExportDataType] = useState<string>("mentions");
  const [exportFormat, setExportFormat] = useState<string>("csv");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("providerId", providerId.toString());
      formData.append("taskType", taskType);

      // Add export-specific data for EXPORT_DATA tasks
      let extraData = {};
      if (taskType === TaskType.EXPORT_DATA) {
        extraData = {
          dataType: exportDataType,
          format: exportFormat,
          includeAspectAnalyses: true, // Default to true for now
        };
      }

      const extraDataString = JSON.stringify(extraData);
      formData.append("extraData", extraDataString);

      //   await addNewTask(formData);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExportTask = taskType === TaskType.EXPORT_DATA;

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="sm">
        <Group>
          <Select
            value={taskType}
            onChange={(value) => setTaskType(value || TaskType.FULL_SYNC)}
            data={[
              { value: TaskType.FULL_SYNC, label: "Full Sync" },
              { value: TaskType.PARTIAL_SYNC, label: "Partial Sync" },
              { value: TaskType.FETCH_CONTENT, label: "Analysis" },
              { value: TaskType.EXPORT_DATA, label: "Export Data" },
            ]}
            style={{ minWidth: 120 }}
            mr="sm"
          />

          {isExportTask && (
            <>
              <Select
                value={exportDataType}
                onChange={(value) => setExportDataType(value || "mentions")}
                data={[
                  { value: "mentions", label: "Comments/Mentions" },
                  { value: "posts", label: "Posts" },
                ]}
                placeholder="Data Type"
                style={{ minWidth: 140 }}
                mr="sm"
              />

              <Select
                value={exportFormat}
                onChange={(value) => setExportFormat(value || "csv")}
                data={[
                  { value: "csv", label: "CSV" },
                  { value: "json", label: "JSON" },
                ]}
                placeholder="Format"
                style={{ minWidth: 100 }}
                mr="sm"
              />
            </>
          )}

          <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
            {isExportTask ? "Start Export" : "Run Task"}
          </Button>
        </Group>

        {error && (
          <Text color="red" size="sm">
            {error}
          </Text>
        )}
      </Stack>
    </form>
  );
};

export default TaskForm;
