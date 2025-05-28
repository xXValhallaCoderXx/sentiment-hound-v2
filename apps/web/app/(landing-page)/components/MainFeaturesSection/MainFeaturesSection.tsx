import {
  Title,
  Text,
  Card,
  SimpleGrid,
  Container,
  rem,
  ThemeIcon,
  Group,
} from "@mantine/core";
import { 
  IconMoodHappy, 
  IconMessageDots, 
  IconChartBar,
  IconTrendingUp,
  IconBrandTwitter,
  IconBrandReddit 
} from "@tabler/icons-react";
import classes from "./MainFeatures.module.css";

const mockdata = [
  {
    title: "Discover user sentiment in real-time",
    description:
      "Get immediate feedback on how customers feel about your product or service with powerful AI-driven sentiment analysis.",
    icon: IconMoodHappy,
    color: "blue",
  },
  {
    title: "Track historical sentiment trends",
    description:
      "Analyze how customer sentiment evolves over time and identify patterns to anticipate future customer needs and reactions.",
    icon: IconTrendingUp,
    color: "indigo",
  },
  {
    title: "Aspect-based sentiment analysis",
    description:
      "Go beyond basic sentiment - understand exactly which aspects of your product or service customers love or want improved.",
    icon: IconChartBar,
    color: "cyan",
  },
];

const socialPlatforms = [
  { name: "Twitter", icon: IconBrandTwitter, color: "blue" },
  { name: "Reddit", icon: IconBrandReddit, color: "orange" },
  { name: "Comments", icon: IconMessageDots, color: "green" },
];

const MainFeaturesSection = () => {
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="sm"
      radius="lg"
      className={classes.card}
      padding="xl"
      withBorder
    >
      <ThemeIcon 
        size={60} 
        radius="md" 
        variant="light" 
        color={feature.color}
        className={classes.cardIcon}
      >
        <feature.icon style={{ width: rem(30), height: rem(30) }} stroke={1.5} />
      </ThemeIcon>
      <Text fz="lg" fw={600} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  const platforms = socialPlatforms.map((platform) => (
    <Group key={platform.name} className={classes.platformBadge}>
      <ThemeIcon size="sm" variant="light" color={platform.color} radius="xl">
        <platform.icon size={14} />
      </ThemeIcon>
      <Text size="xs" fw={500}>{platform.name}</Text>
    </Group>
  ));

  return (
    <Container size="lg" py="xl" className={classes.container}>
      <Title order={2} className={classes.title} ta="center" mt="sm">
        Transform user feedback into actionable insights
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Make data-driven decisions with confidence and stay ahead of the competition.
        Our sentiment analysis platform helps you understand what your users truly think.
      </Text>

      <Group justify="center" mt="md" className={classes.platformGroup}>
        {platforms}
      </Group>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
};

export default MainFeaturesSection;

export default MainFeaturesSection;
