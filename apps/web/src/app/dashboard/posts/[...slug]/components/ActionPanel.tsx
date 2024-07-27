import { FC } from "react";
import { Box, Title, Button, Flex } from "@mantine/core";
import { integrationMenuAction } from "../actions";
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
        <Box p={10}>
          <form action={integrationMenuAction}>
            <SyncSubmitButton />
            <input type="hidden" name="integrationName" value={name} />
            <input type="hidden" name="syncType" value="full" />
          </form>
        </Box>
      </Flex>
    </Box>
  );
};

export default ActionPanel;
