import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  ThemeIcon,
  Paper,
  Stack,
} from "@mantine/core";
import {
  IconRadar,
  IconShieldCheck,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";
import classes from "./YourCommandCenterFeaturesSection.module.css";

const YourCommandCenterFeaturesSection = () => {
  const features = [
    {
      icon: IconRadar,
      title: "The Scent Trail.",
      description: "Our real-time dashboard is your central hub to follow every mention, trend, and insight as it happens.",
      color: "#10B981",
    },
    {
      icon: IconShieldCheck,
      title: "A Well-Groomed Dataset.",
      description: "No more junk. Our AI filters out the noise from bots and spam, so the insights you get are ones you can trust.",
      color: "#3B82F6",
    },
    {
      icon: IconUsers,
      title: "Know the Whole Pack.",
      description: "See how you stack up. Track competitor sentiment to understand your position in the market.",
      color: "#8B5CF6",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge className={classes.badge} size="lg" variant="light">
            <IconTrendingUp size={16} />
            Features
          </Badge>

          <Title order={2} className={classes.title}>
            Your Command Center for Clarity.
          </Title>
        </div>

        <Grid gutter="xl" className={classes.featuresGrid}>
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Paper className={classes.featureCard} p="xl">
                <Stack gap="md">
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="light"
                    color={feature.color}
                    className={classes.featureIcon}
                  >
                    <feature.icon size={24} />
                  </ThemeIcon>

                  <div>
                    <Text className={classes.featureTitle} fw={600} size="lg">
                      {feature.title}
                    </Text>
                    <Text className={classes.featureDescription} c="dimmed" mt="xs">
                      {feature.description}
                    </Text>
                  </div>
                </Stack>
              </Paper>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default YourCommandCenterFeaturesSection;