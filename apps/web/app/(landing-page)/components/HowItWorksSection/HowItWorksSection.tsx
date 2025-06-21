import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  ThemeIcon,
  Group,
  Button,
  Box,
} from "@mantine/core";
import {
  IconPlug,
  IconTarget,
  IconBrain,
  IconChartLine,
  IconPlayerPlay,
} from "@tabler/icons-react";
import classes from "./HowItWorksSection.module.css";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: IconPlug,
      title: "Connect your channels",
      description: "YouTube, Reddit (no login needed)",
      color: "primary",
    },
    {
      icon: IconTarget,
      title: "Track what matters",
      description: "Add keywords, competitors",
      color: "info",
    },
    {
      icon: IconBrain,
      title: "Let the AI do the heavy lifting",
      description: "Real-time filters, spam removal",
      color: "success",
    },
    {
      icon: IconChartLine,
      title: "Get instant clarity",
      description: "Visual dashboards & trend analysis",
      color: "warning",
    },
    {
      icon: IconPlayerPlay,
      title: "Start Free Trial",
      description: "Begin your journey today",
      color: "text-primary",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" py="xl">
        <Title order={2} className={classes.title} ta="center" c="text-primary">
          How Sentiment Hound Works
        </Title>

        <Grid mt="xl" gutter="md" justify="center">
          {steps.map((step, index) => (
            <GridCol key={index} span={{ base: 12, xs: 6, sm: 4, md: 2.4 }}>
              <Box className={classes.stepCard} ta="center">
                <ThemeIcon
                  size={60}
                  radius="xl"
                  variant="light"
                  color={step.color}
                  mb="md"
                  className={classes.stepIcon}
                >
                  <step.icon size={28} stroke={1.5} />
                </ThemeIcon>
                <Text fw={600} size="sm" mb="xs" c="text-primary">
                  {step.title}
                </Text>
                <Text size="xs" c="text-secondary" lh={1.4}>
                  {step.description}
                </Text>
              </Box>
            </GridCol>
          ))}
        </Grid>

        <Group justify="center" mt="xl">
          <Button
            size="md"
            color="primary.5"
            c="white"
            className={classes.ctaButton}
          >
            Start Free Trial
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default HowItWorksSection;