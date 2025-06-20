import Image from "next/image";
import { Group, Anchor, Text } from "@mantine/core";
import { SignInButton } from "@/components/molecules/SignInButton";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";

const NavigationMenu = () => {
  return (
    <Group justify="space-between" px={24} h="100%">
      <Group gap="sm">
        <Image
          src="/images/logos/main-logo.png"
          alt=""
          height={50}
          width={50}
          className="mx-auto"
        />
        <Text>
          <Text span fw={700} c="primary.5" component="span">
            Sentiment
          </Text>{" "}
          Hound
        </Text>
      </Group>

      <Group gap="lg">
        <ThemeToggle />
        <SignInButton />
        <Anchor href="#" c="text-primary" fw={500}>
          Home
        </Anchor>
        <Anchor href="#" c="text-primary" fw={500}>
          About
        </Anchor>
        <Anchor href="#" c="text-primary" fw={500}>
          Services
        </Anchor>
        <Anchor href="#" c="text-primary" fw={500}>
          Contact
        </Anchor>
      </Group>
    </Group>
  );
};

export default NavigationMenu;
