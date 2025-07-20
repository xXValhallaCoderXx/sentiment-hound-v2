import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  rem,
  Paper,
  Stack,
} from "@mantine/core";
import {
  IconShieldLock,
  IconDeviceAnalytics,
  IconCloudComputing,
  IconHeartRateMonitor,
  IconHelpCircle as IconSupportFilled,
  type IconProps,
} from "@tabler/icons-react";
import classes from "./SubFeatures.module.css";

export const MOCKDATA = [
  {
    icon: IconDeviceAnalytics,
    title: "High Performance",
    description:
      "Optimized algorithms process millions of data points in seconds, delivering real-time insights without delay.",
  },
  {
    icon: IconShieldLock,
    title: "Privacy First",
    description:
      "Your data security is paramount. All information is encrypted and processed following strict privacy standards.",
  },
  {
    icon: IconCloudComputing,
    title: "Cloud Native",
    description:
      "Deploy anywhere with cloud-native architecture. Scale effortlessly as your data needs grow.",
  },
  {
    icon: IconHeartRateMonitor,
    title: "Real-time Monitoring",
    description:
      "Track sentiment changes as they happen with live monitoring dashboard and instant alerts.",
  },
  {
    icon: IconSupportFilled,
    title: "24/7 Support",
    description:
      "Dedicated support team available around the clock to ensure your sentiment analysis runs smoothly.",
  },
];

interface FeatureProps {
  icon: React.FC<IconProps>;
  title: React.ReactNode;
  description: React.ReactNode;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Paper p="lg" radius="md" className={classes.featureCard} withBorder>
      <Stack gap="sm">
        <ThemeIcon
          variant="light"
          size={48}
          radius="md"
          className={classes.featureIcon}
        >
          <Icon style={{ width: rem(24), height: rem(24) }} stroke="1.5" />
        </ThemeIcon>
        <div>
          <Text fw={600} fz="lg" mb={6}>
            {title}
          </Text>
          <Text size="sm" c="dimmed" lh={1.6}>
            {description}
          </Text>
        </div>
      </Stack>
    </Paper>
  );
}

const SubFeaturesSection = () => {
  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container className={classes.wrapper} size="xl">
      <Title className={classes.title}>
        Built for Scale, Designed for Simplicity
      </Title>

      <Container size={580} p={0}>
        <Text size="lg" className={classes.description} c="dimmed">
          Enterprise-grade capabilities that are accessible to organizations of
          all sizes. Power without complexity.
        </Text>
      </Container>

      <SimpleGrid
        mt={50}
        cols={{ base: 1, sm: 2, lg: 3 }}
        spacing={{ base: "lg", md: "xl" }}
        verticalSpacing={{ base: "lg", md: "xl" }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
};

export default SubFeaturesSection;
