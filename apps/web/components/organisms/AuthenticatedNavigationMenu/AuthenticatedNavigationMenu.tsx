import { FC } from "react";
import { Burger, Group, Title, Box, Text } from "@mantine/core";
import Image from "next/image";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
interface IAuthenticatedNavigationMenuProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const AuthenticatedNavigationMenu: FC<IAuthenticatedNavigationMenuProps> = ({
  isOpen,
  onToggle,
}) => {
  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        {" "}
        {/* This is the left group */}
        <Burger opened={isOpen} onClick={onToggle} hiddenFrom="sm" size="sm" />
        <Image
          src="/images/logos/main-logo.png"
          alt="Sentiment Hound Logo"
          height={45}
          width={45}
        />
        {/* Replace the existing div and Title with this: */}
        <Box
          ml={{ base: "xs", xs: -8 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <Title order={3} style={{ display: "flex", alignItems: "baseline" }}>
            <Text span inherit fw={700} fz="h3">
              Sentiment
            </Text>
            <Text span inherit fw={400} fz="h3" ml={4} visibleFrom="xs">
              Hound
            </Text>
          </Title>
        </Box>
      </Group>
      <ThemeToggle />
    </Group>
  );
};

export default AuthenticatedNavigationMenu;
