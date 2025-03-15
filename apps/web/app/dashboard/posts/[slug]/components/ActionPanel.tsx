"use client";
import React from "react";
import { Group, Button, Badge, Text, Flex } from "@mantine/core";
import { IconRefresh, IconAnalyze, IconFilter } from "@tabler/icons-react";

interface ActionPanelProps {
  name: string;
}

const ActionPanel = ({ name }: ActionPanelProps) => {
  const handleRefresh = () => {
    // Implement the refresh functionality
    console.log(`Refreshing ${name} posts`);
  };

  const handleAnalyze = () => {
    // Implement the analyze functionality
    console.log(`Analyzing ${name} posts`);
  };

  return (
    <Flex justify="space-between" align="center" mb={4}>
      <Group>
        {/* <Text fw={500} className="capitalize">
          {name} Posts
        </Text> */}
        <Badge color="blue" variant="light">
          Connected
        </Badge>
      </Group>

      <Group>
        <Button
          variant="light"
          leftSection={<IconFilter size={16} />}
          size="xs"
        >
          Filter
        </Button>
        <Button
          variant="light"
          leftSection={<IconAnalyze size={16} />}
          size="xs"
          onClick={handleAnalyze}
        >
          Analyze Posts
        </Button>
        <Button
          variant="filled"
          leftSection={<IconRefresh size={16} />}
          size="xs"
          onClick={handleRefresh}
        >
          Refresh Posts
        </Button>
      </Group>
    </Flex>
  );
};

export default ActionPanel;
