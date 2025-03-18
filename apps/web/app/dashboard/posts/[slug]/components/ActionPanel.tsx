import React from "react";
import { Group, Badge, Flex } from "@mantine/core";
import RefreshButton from "./RefreshButton";
import { TaskType } from "@repo/db";
import FullSyncButton from "./FullSyncButton";
import { addNewTask } from "@/slices/tasks/tasks.actions";
// import AnalyzeButton from "./AnalyzeButton";
// import FilterButton from "./FilterButton";

interface ActionPanelProps {
  name: string;
  providerId: number;
}

const ActionPanel = ({ name, providerId }: ActionPanelProps) => {
  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Group>
        <Badge color="blue" variant="light">
          Connected
        </Badge>
      </Group>

      <Group>
        <form action={addNewTask}>
          <FullSyncButton />
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
        <RefreshButton name={name} />
      </Group>
    </Flex>
  );
};

export default ActionPanel;
