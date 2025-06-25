"use client";
import Image from "next/image";
import { Group, Anchor, Text, Burger, Drawer, Stack, Box, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const SimpleNavigationMenu = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const navigationLinks = (
    <>
      <Anchor href="/" c="dimmed" fw={500} onClick={close}>
        Home
      </Anchor>
      <Anchor href="/#features" c="dimmed" fw={500} onClick={close}>
        Features
      </Anchor>
      <Anchor href="/#how-it-works" c="dimmed" fw={500} onClick={close}>
        How It Works
      </Anchor>
      <Anchor href="/pricing" c="dimmed" fw={500} onClick={close}>
        Pricing
      </Anchor>
    </>
  );

  return (
    <>
      <Group justify="space-between" px={24} h="100%">
        <Group gap="sm">
          <Text c="dimmed">
            <Text span fw={700} c="primary.5" component="span">
              Sentiment
            </Text>{" "}
            Hound
          </Text>
        </Group>

        {/* Desktop Navigation */}
        <Group gap="lg" visibleFrom="md">
          <Button variant="outline" size="sm">Sign In</Button>
          {navigationLinks}
        </Group>

        {/* Mobile Navigation */}
        <Group gap="sm" hiddenFrom="md">
          <Burger
            opened={opened}
            onClick={open}
            aria-label="Toggle navigation"
          />
        </Group>
      </Group>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} c="dimmed">
            <Text span fw={700} c="primary.5" component="span">
              Sentiment
            </Text>{" "}
            Hound
          </Text>
        }
        padding="md"
        size="xs"
        position="right"
      >
        <Stack gap="lg">
          <Box>
            <Button variant="outline" size="sm" fullWidth>Sign In</Button>
          </Box>
          <Stack gap="md">{navigationLinks}</Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default SimpleNavigationMenu;