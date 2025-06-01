import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  Group,
} from "@mantine/core";
import { 
  IconMessageSearch, 
  IconChartDonut3, 
  IconAspectRatio
} from "@tabler/icons-react";
import classes from "./MainFeatures.module.css";

const mockdata = [
  {
    title: "Discover what your users are saying",
    description:
      "Harness our advanced AI to uncover valuable insights from customer feedback across all your channels.",
    icon: IconMessageSearch,
  },
  {
    title: "Analyze Historical Data",
    description:
      "Track sentiment trends over time to predict future patterns and make data-informed strategic decisions.",
    icon: IconChartDonut3,
  },
  {
    title: "More than just sentiment analysis",
    description:
      "With aspect-based analysis, understand the specific features or attributes driving customer sentiment.",
    icon: IconAspectRatio,
  },
];

const MainFeaturesSection = () => {
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <Group wrap="nowrap" gap="md" align="flex-start" mb="md">
        <feature.icon
          style={{ width: rem(50), height: rem(50) }}
          stroke={1.5}
          color="var(--mantine-color-blue-filled)"
        />
        <Text fz="lg" fw={600} className={classes.cardTitle}>
          {feature.title}
        </Text>
      </Group>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <div className={classes.mainFeatureWrapper}>
      <Container size="lg" py="xl">
        <Title order={2} className={classes.title} ta="center" mt="sm">
          Transform Data into Actionable Insights
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Make data-driven decisions with confidence and stay ahead of the curve.
          Experience the power of our sentiment analysis product today and
          revolutionize your decision-making process.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
          {features}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default MainFeaturesSection;
