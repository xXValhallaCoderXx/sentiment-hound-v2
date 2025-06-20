import { Group, Anchor, Text, Button } from "@mantine/core";

const NavigationMenu = () => {
  return (
    <Group justify="space-between" px={24} h="100%">
      <Group gap="sm">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #ff4757, #ff6b7a)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size="sm" fw={700} c="white">
            S
          </Text>
        </div>
        <Text c="white" fw={600}>
          Sentiment Hound
        </Text>
      </Group>

      <Group gap="lg">
        <Anchor href="#" c="white" fw={500} size="sm">
          Features
        </Anchor>
        <Anchor href="#" c="white" fw={500} size="sm">
          Pricing
        </Anchor>
        <Anchor href="#" c="white" fw={500} size="sm">
          Docs
        </Anchor>
        <Anchor href="#" c="white" fw={500} size="sm">
          Blog
        </Anchor>
        <Button variant="outline" color="white" size="sm">
          Sign In
        </Button>
        <Button color="red" size="sm" style={{ backgroundColor: "#ff4757" }}>
          Get Started Free
        </Button>
      </Group>
    </Group>
  );
};

export default NavigationMenu;
