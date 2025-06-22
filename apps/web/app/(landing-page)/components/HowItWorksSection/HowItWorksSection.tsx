import { Container, Title, Text, Group, Button, Badge } from "@mantine/core";
import {
  IconPlug,
  IconTarget,
  IconBrain,
  IconChartLine,
  IconRocket,
  IconArrowRight,
} from "@tabler/icons-react";
import classes from "./HowItWorksSection.module.css";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: IconPlug,
      title: "Connect your channels",
      description:
        "Integrate with YouTube, Reddit, and more platforms instantly",
      color: "#3B82F6",
      number: "01",
    },
    {
      icon: IconTarget,
      title: "Track what matters",
      description: "Set keywords, competitors, and custom tracking parameters",
      color: "#10B981",
      number: "02",
    },
    {
      icon: IconBrain,
      title: "AI analysis",
      description: "Advanced ML models process sentiment in real-time",
      color: "#8B5CF6",
      number: "03",
    },
    {
      icon: IconChartLine,
      title: "Get insights",
      description: "Visual dashboards with actionable intelligence",
      color: "#F59E0B",
      number: "04",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge className={classes.badge} size="lg" variant="light">
            How It Works
          </Badge>
          <Title order={2} className={classes.title}>
            Get real-time insights in minutes
          </Title>
          <Text className={classes.subtitle}>
            Our AI-powered platform transforms raw social data into actionable
            business intelligence
          </Text>
        </div>

        <div className={classes.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={classes.stepWrapper}>
              <div className={classes.stepCard}>
                <div className={classes.stepNumber}>{step.number}</div>
                <div
                  className={classes.stepIcon}
                  style={{ backgroundColor: step.color }}
                >
                  <step.icon size={24} stroke={1.5} color="white" />
                </div>
                <div className={classes.stepContent}>
                  <Text className={classes.stepTitle}>{step.title}</Text>
                  <Text className={classes.stepDescription}>
                    {step.description}
                  </Text>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={classes.stepConnector}>
                  <IconArrowRight size={20} stroke={1.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <Group justify="center" className={classes.ctaGroup}>
          <Button
            size="lg"
            className={classes.ctaButton}
            leftSection={<IconRocket size={20} />}
          >
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            size="lg"
            className={classes.secondaryButton}
          >
            View Demo
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default HowItWorksSection;
