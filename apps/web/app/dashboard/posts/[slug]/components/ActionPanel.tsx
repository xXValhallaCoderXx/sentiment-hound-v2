import React from "react";
import { Group, Badge, Flex } from "@mantine/core";
import RefreshButton from "./RefreshButton";
// import AnalyzeButton from "./AnalyzeButton";
// import FilterButton from "./FilterButton";

interface ActionPanelProps {
  name: string;
}

const ActionPanel = ({ name }: ActionPanelProps) => {
  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Group>
        <Badge color="blue" variant="light">
          Connected
        </Badge>
      </Group>

      <Group>
        <RefreshButton name={name} />
      </Group>
    </Flex>
  );
};

export default ActionPanel;
