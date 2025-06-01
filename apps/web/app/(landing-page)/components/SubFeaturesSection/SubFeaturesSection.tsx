import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  rem,
  Paper,
} from "@mantine/core";
import {
  IconShieldLock,
  IconDeviceAnalytics,
  IconCloudComputing,
  IconHeartRateMonitor,
  IconHelpCircle as IconSupportFilled,
} from "@tabler/icons-react";
import classes from "./SubFeatures.module.css";

export const MOCKDATA = [
  {
    icon: IconDeviceAnalytics,
    title: "High Performance",
    description:
      "Our optimized algorithms process millions of data points in seconds, providing real-time insights without delay.",
  },
  {
    icon: IconShieldLock,
    title: "Privacy Focused",
    description:
      "Your data security is our priority. All information is encrypted and processed following strict privacy standards.",
  },
  {
    icon: IconCloudComputing,
    title: "Cloud Native",
    description:
      "Deploy anywhere with our cloud-native architecture. Scale effortlessly as your data needs grow.",
  },
  {
    icon: IconHeartRateMonitor,
    title: "Real-time Monitoring",
    description:
      "Track sentiment changes as they happen with our real-time monitoring dashboard and receive instant alerts.",
  },
  {
    icon: IconSupportFilled,
    title: "24/7 Support",
    description:
      "Our dedicated support team is available around the clock to ensure your sentiment analysis runs smoothly.",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Paper 
      p="md" 
      radius="md" 
      className={classes.featureCard}
      withBorder
    >
      <ThemeIcon variant="light" size={50} radius={50} className={classes.featureIcon}>
        <Icon style={{ width: rem(24), height: rem(24) }} stroke={1.5} />
      </ThemeIcon>
      <Text fw={700} fz="lg" mt="sm" mb={7}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </Paper>
  );
}

const SubFeaturesSection = () => {
  const features = MOCKDATA.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Container className={classes.wrapper}>
      <Title className={classes.title}>
        Enterprise-grade Features for Everyone
      </Title>

      <Container size={560} p={0}>
        <Text size="sm" className={classes.description}>
          Sentiment Hound provides powerful tools that are accessible to organizations of all sizes.
          Leverage enterprise capabilities without the enterprise price tag.
        </Text>
      </Container>

      <SimpleGrid
        mt={60}
        cols={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: "xl", md: 30 }}
        verticalSpacing={{ base: "xl", md: 30 }}
      >
        {features}
      </SimpleGrid>
    </Container>
  );
};

export default SubFeaturesSection;
