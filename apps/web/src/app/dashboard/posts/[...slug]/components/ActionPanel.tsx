import { FC } from "react";
import {
  Box,
  Title,
  Stack,
  Button,
  Flex,
  MenuDivider,
  Text,
  Menu,
  rem,
  MenuTarget,
  MenuDropdown,
  MenuLabel,
  MenuItem,
} from "@mantine/core";
import { MessageCircle, Trash } from "lucide-react";

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
          <Menu shadow="md" width={200}>
            <MenuTarget>
              <Button>Action</Button>
            </MenuTarget>

            <MenuDropdown>
              <MenuLabel>Integrations</MenuLabel>
              <MenuItem>Partial Integration</MenuItem>
              <MenuItem>Full Integration</MenuItem>
              <MenuItem>Content Integration</MenuItem>

              <MenuDivider />

              <MenuLabel>Danger zone</MenuLabel>

              <MenuItem
                color="red"
                leftSection={
                  <Trash style={{ width: rem(14), height: rem(14) }} />
                }
              >
                Delete Integration
              </MenuItem>
            </MenuDropdown>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
};

export default ActionPanel;
