import React from "react";
import { Group, Badge, Flex } from "@mantine/core";
import { TaskType } from "@repo/db";
// import FullSyncButton from "./FullSyncButton";
import { addNewTask } from "@/slices/tasks/tasks.actions";

interface ActionPanelProps {
  providerId: number;
}

const ActionPanel = ({ providerId }: ActionPanelProps) => {
  return (
    <Flex justify="space-between" align="center" mt={8} mb={16}>
      <Group>
        <Badge color="gray" variant="light">
          Last sync: 2 hours ago
        </Badge>
      </Group>

      <Group>
        <form action={addNewTask}>
          {/* <FullSyncButton /> */}
          <input
            type="text"
            hidden
            readOnly
            name="providerId"
            value={providerId}
          />
          <input
            type="text"
            hidden
            readOnly
            name="taskType"
            value={TaskType.FULL_SYNC}
          />
        </form>
      </Group>
    </Flex>
  );
};

export default ActionPanel;
