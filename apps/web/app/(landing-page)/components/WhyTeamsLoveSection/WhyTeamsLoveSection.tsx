import { Container, Title, Text, Grid, GridCol, Badge } from "@mantine/core";
import {
  IconShieldCheck,
  IconEye,
  IconBrain,
  IconHeart,
} from "@tabler/icons-react";
import classes from "./WhyTeamsLoveSection.module.css";

const WhyTeamsLoveSection = () => {
  const features = [
    {
      icon: IconShieldCheck,
      title: "Noise-free insights",
      description:
        "Advanced AI filters eliminate spam, bots, and irrelevant content to deliver pure, actionable intelligence.",
      color: "#10B981",
      stats: "99.2% accuracy",
    },
    {
      icon: IconEye,
      title: "Built for clarity",
      description:
        "Intuitive dashboards designed for decision-makers, not data analysts. See what matters most at a glance.",
      color: "#3B82F6",
      stats: "< 30 seconds to insights",
    },
    {
      icon: IconBrain,
      title: "AI-powered decisions",
      description:
        "Machine learning models trained on millions of data points understand context, sentiment, and trends.",
      color: "#8B5CF6",
      stats: "24/7 real-time analysis",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge className={classes.badge} size="lg" variant="light">
            <IconHeart size={16} />
            Why Teams Choose Us
          </Badge>

          <Title order={2} className={classes.title}>
            Why teams love using Sentiment Hound
          </Title>

          <Text className={classes.subtitle}>
            Trusted by marketing teams, product managers, and executives who
            need reliable sentiment intelligence to make confident decisions.
          </Text>
        </div>

        <Grid gutter="xl" className={classes.featuresGrid}>
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <div className={classes.featureCard}>
                <div className={classes.cardContent}>
                  <div
                    className={classes.featureIcon}
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon size={28} color="white" stroke={1.5} />
                  </div>

                  <div className={classes.featureHeader}>
                    <Text className={classes.featureTitle}>
                      {feature.title}
                    </Text>
                    <Text className={classes.featureStats}>
                      {feature.stats}
                    </Text>
                  </div>

                  <Text className={classes.featureDescription}>
                    {feature.description}
                  </Text>
                </div>

                <div
                  className={classes.cardGlow}
                  style={{ backgroundColor: feature.color }}
                ></div>
              </div>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default WhyTeamsLoveSection;