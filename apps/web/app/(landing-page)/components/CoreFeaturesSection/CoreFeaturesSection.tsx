import { Container, Title, Text, Grid, GridCol, Box } from "@mantine/core";
import {
  IconDashboard,
  IconShieldCheck,
  IconTrendingUp,
} from "@tabler/icons-react";
import classes from "./CoreFeaturesSection.module.css";

const CoreFeaturesSection = () => {
  const features = [
    {
      icon: IconDashboard,
      title: "Mission Control",
      description:
        "Real-time sentiment monitoring dashboard with live scores, trends, and filtered mentions all in one unified view.",
    },
    {
      icon: IconShieldCheck,
      title: "Noise Filtering",
      description:
        "Advanced spam and bot detection that filters out irrelevant mentions so you only see authentic human sentiment.",
    },
    {
      icon: IconTrendingUp,
      title: "Competitive Intelligence",
      description:
        "Side-by-side sentiment comparisons with competitors, shared keyword analysis, and market positioning insights.",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <div className={classes.header}>
          <Title order={2} className={classes.title}>
            Your Complete Toolkit for Brand Intelligence
          </Title>
          <Text className={classes.subtitle}>
            Sentiment Hound goes beyond sentiment analysis to provide a full
            suite of tools for understanding your brand&rsquo;s voice.
          </Text>
        </div>

        <Grid gutter="xl" justify="center" className={classes.featuresGrid}>
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <div className={classes.featureCard}>
                <Box className={classes.iconContainer}>
                  <feature.icon size={48} className={classes.icon} />
                </Box>

                <Title order={3} className={classes.featureTitle}>
                  {feature.title}
                </Title>

                <Text className={classes.featureDescription}>
                  {feature.description}
                </Text>
              </div>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default CoreFeaturesSection;
