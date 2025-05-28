"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Select, Button, Group, Flex } from "@mantine/core";
import { TaskStatus, TaskType } from "@repo/db";

const TaskFilter: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentStatus = searchParams.get("status") as TaskStatus | null;
  const currentType = searchParams.get("type") as TaskType | null;

  const handleApplyFilters = (status?: TaskStatus, type?: TaskType) => {
    // Create new params object from current params to preserve pagination
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove status filter
    if (status) {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    // Update or remove type filter
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    // Reset to page 1 when filters change
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <Flex justify="flex-end" mb="lg">
      <Flex gap={16}>
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
            handleApplyFilters(value as TaskStatus, currentType || undefined)
          }
          value={currentStatus || null}
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
          onChange={(value) =>
            handleApplyFilters(currentStatus || undefined, value as TaskType)
          }
          value={currentType || null}
          clearable
        />
        <Flex align="flex-end">
          <Button onClick={() => handleApplyFilters(undefined, undefined)}>
            Clear Filters
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default TaskFilter;
