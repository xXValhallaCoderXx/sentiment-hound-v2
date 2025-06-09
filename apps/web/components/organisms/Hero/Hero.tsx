import { Container, Text, Button, Group, Box } from "@mantine/core";
import { IconChartBar, IconArrowRight } from "@tabler/icons-react";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.backgroundPattern}></div>
      <Container size={1200} className={classes.inner}>
        <h1 className={classes.title}>
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Turn Noise into Narrative.
          </Text>
        </h1>
        <Text className={classes.description} color="dimmed">
          Sentiment Hound is a modern, AI-powered platform that transforms chaotic online conversations into clear, actionable insights.
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="filled" // Ensuring primary button is filled
            color="primary"
            leftSection={<IconChartBar size={20} />}
          >
            Get Started
          </Button>
          <Button
            size="xl"
            className={classes.controlSecondary}
            variant="outline" // Keeping outline variant for secondary
            rightSection={<IconArrowRight size={16} />}
          >
            How it Works ↓
          </Button>
        </Group>

        <Box className={classes.statsBadges}>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">
              Trusted by
            </Text>
            <Text fw={700} size="xl">
              500+
            </Text>
            <Text c="dimmed" size="xs">
              Companies
            </Text>
          </div>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">
              Processing
            </Text>
            <Text fw={700} size="xl">
              10M+
            </Text>
            <Text c="dimmed" size="xs">
              Statements Daily
            </Text>
          </div>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">
              Accuracy
            </Text>
            <Text fw={700} size="xl">
              98%
            </Text>
            <Text c="dimmed" size="xs">
              Sentiment Score
            </Text>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Hero;
