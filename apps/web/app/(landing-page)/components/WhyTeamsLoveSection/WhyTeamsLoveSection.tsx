import { Container, Title, Text, Grid, GridCol } from "@mantine/core";
import {
  IconRocket,
  IconBulb,
  IconSparkles,
  IconHeart,
} from "@tabler/icons-react";
import { Badge } from "@/components/atoms/Badge";
import classes from "./WhyTeamsLoveSection.module.css";

const WhyTeamsLoveSection = () => {
  const features = [
    {
      icon: IconRocket,
      title: "Power That's Unleashed, Not Locked Up",
      description:
        "We pack enterprise-grade features into a simple, affordable platform. We believe the best tools should be for everyone, not locked behind complex enterprise contracts.",
    },
    {
      icon: IconBulb,
      title: "Clarity You Can Act On",
      description:
        "We deliver actionable insights, not just data dumps. Our goal is to give you the confidence to make your next move the right one with clear, understandable analytics.",
    },
    {
      icon: IconSparkles,
      title: "Professional, Not Boring",
      description:
        "We combine intuitive design with serious data quality. We're building the tool we've always wanted to use - powerful yet delightful, professional yet approachable.",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge 
            variant="filled" 
            colorScheme="secondary" 
            icon={<IconHeart size={14} />}
          >
            WHY YOU&apos;LL LOVE US
          </Badge>

          <Title order={2} className={classes.title}>
            Built for the Underdog, With a Bigger Bite.
          </Title>

          <Text className={classes.subtitle}>
            Trusted by marketing teams, product managers, and executives who
            need reliable sentiment intelligence to make confident decisions.
          </Text>
        </div>

        <Grid gutter="xl" justify="center" className={classes.featuresGrid}>
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <div className={classes.featureCard}>
                <div className={classes.iconContainer}>
                  <feature.icon size={48} className={classes.icon} />
                </div>

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

export default WhyTeamsLoveSection;