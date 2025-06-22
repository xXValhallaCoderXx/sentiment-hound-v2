import { Container, Title, Text, Group, Button, Badge } from "@mantine/core";
import {
  IconPlug,
  IconTarget,
  IconChartLine,
  IconRocket,
  IconArrowRight,
} from "@tabler/icons-react";
import classes from "./HowItWorksSection.module.css";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: IconPlug,
      title: "Connect Your Content.",
      description:
        "Securely link your YouTube, Reddit, or other platforms in just a few clicks.",
      color: "#3B82F6",
      number: "01",
    },
    {
      icon: IconTarget,
      title: "Unleash the Hounds.",
      description:
        "Our AI gets to work, sniffing out every mention and analyzing the true sentiment behind the words.",
      color: "#10B981",
      number: "02",
    },
    {
      icon: IconChartLine,
      title: "Act with Confidence.",
      description:
        "View everything on a single, beautiful dashboard and make smarter decisions with data you can trust.",
      color: "#8B5CF6",
      number: "03",
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
            Get Real Insights in Minutes.
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
      </Container>
    </div>
  );
};

export default HowItWorksSection;
