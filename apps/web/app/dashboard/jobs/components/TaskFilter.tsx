"use client";
import { useRouter } from "next/navigation";
import { Box, Select, Button, Group } from "@mantine/core";
import { TaskStatus, TaskType } from "@repo/db";

const TaskFilter: React.FC = () => {
  const router = useRouter();

  const handleApplyFilters = (status?: TaskStatus, type?: TaskType) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (type) params.set("type", type);

    router.push(`?${params.toString()}`);
  };

  return (
    <Box mb="lg">
      <Group>
        <Select
          label="Status"
          placeholder="Select status"
          data={Object.values(TaskStatus).map((status) => ({
            value: status,
            label: status
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          }))}
          onChange={(value) =>
            handleApplyFilters(value as TaskStatus, undefined)
          }
          clearable
        />

        <Select
          label="Type"
          placeholder="Select type"
          data={Object.values(TaskType).map((type) => ({
            value: type,
            label: type
              .replace(/_/g, " ")
              .toLowerCase()
              .replace(/\b\w/g, (l) => l.toUpperCase()),
          }))}
          onChange={(value) => handleApplyFilters(undefined, value as TaskType)}
          clearable
        />

        <Button onClick={() => handleApplyFilters(undefined, undefined)}>
          Clear Filters
        </Button>
      </Group>
    </Box>
  );
};

export default TaskFilter;
