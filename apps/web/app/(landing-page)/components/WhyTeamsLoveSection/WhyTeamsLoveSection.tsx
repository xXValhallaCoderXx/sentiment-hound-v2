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
      title: "Power That's Unleashed, Not Locked Up.",
      description:
        "We believe the best tools should be for everyone. We packed enterprise-level features into a simple, affordable platform for the new generation of builders.",
      color: "#10B981",
      stats: "Enterprise-grade",
    },
    {
      icon: IconEye,
      title: "Clarity You Can Act On.",
      description:
        "We don't just show you data; we help you understand it. Our goal is to give you the confidence to make your next move the right one.",
      color: "#3B82F6",
      stats: "Actionable insights",
    },
    {
      icon: IconBrain,
      title: "Professional, Not Boring.",
      description:
        "We're serious about the quality of our data, but we don't think software has to be dull. We're building the tool we've always wanted to use.",
      color: "#8B5CF6",
      stats: "Intuitive design",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge className={classes.badge} size="lg" variant="light">
            <IconHeart size={16} />
            Why You&apos;ll Love Us
          </Badge>

          <Title order={2} className={classes.title}>
            Built for the Underdog, With a Bigger Bite.
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