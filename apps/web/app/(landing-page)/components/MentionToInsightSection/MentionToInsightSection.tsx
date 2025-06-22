import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  ThemeIcon,
} from "@mantine/core";
import {
  IconPlug,
  IconEye,
  IconActivity,
  IconMessageCircle,
} from "@tabler/icons-react";
import classes from "./MentionToInsightSection.module.css";

const MentionToInsightSection = () => {
  const steps = [
    {
      icon: <IconPlug size={24} />,
      title: "Connect your channels",
      description: "YouTube, Reddit, more coming soon.",
      color: "red",
    },
    {
      icon: <IconEye size={24} />,
      title: "Define what matters",
      description: "Set keywords, choose filters.",
      color: "orange",
    },
    {
      icon: <IconActivity size={24} />,
      title: "Let AI do its work",
      description: "Real-time sentiment analysis + filtering.",
      color: "blue",
    },
    {
      icon: <IconMessageCircle size={24} />,
      title: "Get insights",
      description: "See what's working and what's not.",
      color: "teal",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.header}>
          <Title order={2} className={classes.title} ta="center">
            From mention to insight — in seconds
          </Title>
        </div>

        <Grid mt="xl" gutter="xl" justify="center">
          {steps.map((step, index) => (
            <GridCol key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <Box className={classes.stepCard} ta="center">
                <div className={classes.iconWrapper}>
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    color={step.color}
                    variant="light"
                    className={classes.stepIcon}
                  >
                    {step.icon}
                  </ThemeIcon>
                </div>
                <Title order={4} className={classes.stepTitle} mt="md">
                  {step.title}
                </Title>
                <Text className={classes.stepDescription} mt="sm">
                  {step.description}
                </Text>
                {index < steps.length - 1 && (
                  <div className={classes.connector} />
                )}
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default MentionToInsightSection;
