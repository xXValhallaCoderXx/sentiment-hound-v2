import { Container, Text, Group, Anchor, Stack } from "@mantine/core";

const SimpleFooter = () => {
  return (
    <div style={{ 
      background: 'var(--mantine-color-dark-8)', 
      padding: '2rem 0', 
      borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
    }}>
      <Container size="xl">
        <Stack gap="md">
          <Group justify="center" gap="xl">
            <Anchor href="/" c="dimmed" size="sm">
              Home
            </Anchor>
            <Anchor href="/pricing" c="dimmed" size="sm">
              Pricing
            </Anchor>
            <Anchor href="/#features" c="dimmed" size="sm">
              Features
            </Anchor>
          </Group>
          <Text ta="center" c="dimmed" size="sm">
            © 2024 Sentiment Hound. All rights reserved.
          </Text>
        </Stack>
      </Container>
    </div>
  );
};

export default SimpleFooter;