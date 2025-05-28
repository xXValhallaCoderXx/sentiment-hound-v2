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
            Unlock Valuable Insights
          </Text>
          <br />
          with Powerful Sentiment Analysis
        </h1>
        <Text className={classes.description} color="dimmed">
          <strong>Sentiment Hound</strong> transforms raw feedback into actionable intelligence.
          Discover what your customers truly think and make data-driven decisions
          that drive business growth.
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            leftSection={<IconChartBar size={20} />}
          >
            Start Free Trial
          </Button>
          <Button
            size="xl"
            className={classes.controlSecondary}
            variant="outline"
            rightSection={<IconArrowRight size={16} />}
          >
            See Demo
          </Button>
        </Group>
        
        <Box className={classes.statsBadges}>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">Trusted by</Text>
            <Text fw={700} size="xl">500+</Text>
            <Text c="dimmed" size="xs">Companies</Text>
          </div>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">Processing</Text>
            <Text fw={700} size="xl">10M+</Text>
            <Text c="dimmed" size="xs">Statements Daily</Text>
          </div>
          <div className={classes.statItem}>
            <Text c="dimmed" size="sm">Accuracy</Text>
            <Text fw={700} size="xl">98%</Text>
            <Text c="dimmed" size="xs">Sentiment Score</Text>
          </div>
        </Box>
      </Container>
    </div>
  );
};

export default Hero;

export default Hero;
