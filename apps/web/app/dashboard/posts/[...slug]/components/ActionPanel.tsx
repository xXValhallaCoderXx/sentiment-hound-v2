import { FC } from "react";
import { Box, Title, Button, Flex } from "@mantine/core";
import FetchContentButton from "./FetchContentButton";
import SyncSubmitButton from "./SyncSubmitButton";

interface IActionPanelProps {
  name: string;
}

const ActionPanel: FC<IActionPanelProps> = ({ name }) => {
  return (
    <Box>
      <Flex justify="space-between">
        <Title className="capitalize" order={2}>
          {name}
        </Title>
        <Flex gap={8} p={10}>
          <FetchContentButton name={name} />
          <SyncSubmitButton name={name} />
        </Flex>
      </Flex>
    </Box>
  );
};

export default ActionPanel;
