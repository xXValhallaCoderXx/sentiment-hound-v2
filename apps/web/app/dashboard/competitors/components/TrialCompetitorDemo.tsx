import {
  Card,
  Text,
  Title,
  Alert,
  SimpleGrid,
  Badge,
  Group,
  Stack,
} from "@mantine/core";
import { IconInfoCircle, IconTrendingUp } from "@tabler/icons-react";

const TrialCompetitorDemo = () => {
  const demoCompetitors = [
    {
      name: "Apple Inc.",
      sentiment: 0.7,
      trend: "up",
      mentions: 2847,
    },
    {
      name: "Samsung",
      sentiment: 0.3,
      trend: "down",
      mentions: 1923,
    },
    {
      name: "Google",
      sentiment: 0.5,
      trend: "up",
      mentions: 3241,
    },
  ];

  return (
    <Card withBorder p="md">
      <Title order={3} mb="md">
        Competitor Analysis Preview
      </Title>

      <Alert
        variant="light"
        color="blue"
        mb="lg"
        icon={<IconInfoCircle size={16} />}
      >
        This is a preview of our competitor analysis feature. Upgrade to track
        your own competitors!
      </Alert>

      <Text size="sm" c="dimmed" mb="lg">
        See how major brands are performing across social media platforms:
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        {demoCompetitors.map((competitor) => (
          <Card key={competitor.name} withBorder p="sm" radius="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500} size="sm">
                {competitor.name}
              </Text>
              <Badge
                variant="light"
                color={
                  competitor.sentiment > 0.5
                    ? "green"
                    : competitor.sentiment > 0
                      ? "yellow"
                      : "red"
                }
                size="sm"
              >
                {competitor.sentiment > 0.5
                  ? "Positive"
                  : competitor.sentiment > 0
                    ? "Neutral"
                    : "Negative"}
              </Badge>
            </Group>

            <Stack gap="xs" mt="md">
              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Sentiment Score:
                </Text>
                <Text size="sm" fw={500}>
                  {competitor.sentiment.toFixed(1)}
                </Text>
              </Group>

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  Mentions (7 days):
                </Text>
                <Group gap={4}>
                  <Text size="sm" fw={500}>
                    {competitor.mentions.toLocaleString()}
                  </Text>
                  <IconTrendingUp
                    size={14}
                    color={competitor.trend === "up" ? "green" : "red"}
                  />
                </Group>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
};

export default TrialCompetitorDemo;
