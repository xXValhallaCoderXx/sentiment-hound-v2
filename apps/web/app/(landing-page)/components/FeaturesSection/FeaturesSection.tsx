import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Card,
  ThemeIcon,
} from "@mantine/core";
import { IconRadar, IconShield, IconTrendingUp } from "@tabler/icons-react";
import classes from "./FeaturesSection.module.css";

const FeaturesSection = () => {
  const features = [
    {
      icon: IconRadar,
      title: "The Scent Trail.",
      description:
        "Our real-time dashboard is your central hub to follow every mention, trend, and insight as it happens.",
      color: "#3B82F6",
    },
    {
      icon: IconShield,
      title: "A Well-Groomed Dataset.",
      description:
        "No more junk. Our AI filters out the noise from bots and spam, so the insights you get are ones you can trust.",
      color: "#10B981",
    },
    {
      icon: IconTrendingUp,
      title: "Know the Whole Pack.",
      description:
        "See how you stack up. Track competitor sentiment to understand your position in the market.",
      color: "#F59E0B",
    },
  ];

  return (
    <section className={classes.wrapper}>
      <Container size={1400} className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title} ta="center">
            Your Command Center for Clarity.
          </Title>
        </div>

        <Grid mt={60} gutter="xl">
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Card className={classes.featureCard} p="xl" radius="lg" h="100%">
                <ThemeIcon
                  size={60}
                  radius="md"
                  variant="light"
                  color={feature.color}
                  className={classes.featureIcon}
                >
                  <feature.icon size={30} />
                </ThemeIcon>

                <Text
                  className={classes.featureTitle}
                  fw={600}
                  size="xl"
                  mt="md"
                >
                  {feature.title}
                </Text>

                <Text className={classes.featureDescription} c="dimmed" mt="sm">
                  {feature.description}
                </Text>
              </Card>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default FeaturesSection;
