import {
  ThemeIcon,
  Text,
  Title,
  Container,
  SimpleGrid,
  rem,
  Box,
} from "@mantine/core";
import { 
  IconCloudComputing,
  IconShieldCheck, 
  IconReportAnalytics,
  IconApi, 
  IconClock24, 
  IconAdjustments 
} from "@tabler/icons-react";
import classes from "./SubFeatures.module.css";

const featureData = [
  {
    icon: IconCloudComputing,
    title: "Cloud-Based Solution",
    description:
      "Our platform is fully cloud-based, ensuring you can access your sentiment analysis data from anywhere, anytime without complex setup.",
    color: "blue",
  },
  {
    icon: IconShieldCheck,
    title: "Data Privacy & Security",
    description:
      "We prioritize your data security with enterprise-grade encryption and compliance with global privacy standards.",
    color: "green",
  },
  {
    icon: IconReportAnalytics,
    title: "Comprehensive Reporting",
    description:
      "Generate detailed reports with actionable insights and visualizations that help you understand sentiment trends at a glance.",
    color: "violet",
  },
  {
    icon: IconApi,
    title: "API Integration",
    description:
      "Seamlessly integrate with your existing tools through our robust API, enabling automated workflows and real-time data access.",
    color: "orange",
  },
  {
    icon: IconClock24,
    title: "24/7 Monitoring",
    description:
      "Set up continuous monitoring of sentiment across all your platforms to catch issues before they escalate into major problems.",
    color: "cyan",
  },
  {
    icon: IconAdjustments,
    title: "Customizable Analysis",
    description:
      "Tailor your sentiment analysis parameters to focus on what matters most to your business with flexible configuration options.",
    color: "pink",
  },
];

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
  color: string;
}

function Feature({ icon: Icon, title, description, color }: FeatureProps) {
  return (
    <Box className={classes.feature}>
      <ThemeIcon variant="light" size={50} radius="md" color={color} className={classes.featureIcon}>
        <Icon style={{ width: rem(22), height: rem(22) }} stroke={1.5} />
      </ThemeIcon>
      <Text mt="sm" mb={7} fw={600} fz="md" className={classes.featureTitle}>
        {title}
      </Text>
      <Text size="sm" c="dimmed" lh={1.6}>
        {description}
      </Text>
    </Box>
  );
}

const SubFeaturesSection = () => {
  const features = featureData.map((feature, index) => (
    <Feature {...feature} key={index} />
  ));

  return (
    <Box className={classes.sectionWrapper}>
      <Container className={classes.wrapper}>
        <Title className={classes.title}>
          Advanced features that power your insights
        </Title>

        <Container size={560} p={0}>
          <Text size="sm" className={classes.description}>
            Sentiment Hound offers a comprehensive suite of tools designed to help businesses 
            of all sizes leverage the power of sentiment analysis to drive growth and customer satisfaction.
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
    </Box>
  );
};

export default SubFeaturesSection;
