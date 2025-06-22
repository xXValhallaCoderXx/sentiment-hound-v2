import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconTool,
  IconPin,
  IconSettings,
  IconChartDots,
} from "@tabler/icons-react";
import classes from "./SignUpToInsightSection.module.css";

const SignUpToInsightSection = () => {
  const steps = [
    {
      icon: IconTool,
      title: "Setup in minutes",
      description: "No login required",
      emoji: "🛠",
    },
    {
      icon: IconPin,
      title: "Add keywords & channels",
      description: "Focus only on what matters",
      emoji: "📌",
    },
    {
      icon: IconSettings,
      title: "Let AI filter & analyze",
      description: "Spam-free insights instantly",
      emoji: "⚙️",
    },
    {
      icon: IconChartDots,
      title: "Start seeing patterns",
      description: "Sentiment and trends in real time",
      emoji: "📊",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" py="xl" className={classes.container}>
        <Title order={2} className={classes.title} ta="center" c="white">
          From sign-up to clarity — in seconds
        </Title>

        <Grid mt="xl" gutter="xl" justify="center">
          {steps.map((step, index) => (
            <GridCol key={index} span={{ base: 12, xs: 6, md: 3 }}>
              <Box className={classes.stepCard} ta="center">
                <ThemeIcon
                  size={50}
                  radius="xl"
                  variant="light"
                  color="primary.5"
                  mb="md"
                  className={classes.stepIcon}
                >
                  <step.icon size={24} stroke={1.5} />
                </ThemeIcon>
                <Text fw={600} size="md" mb="xs" c="white">
                  {step.title}
                </Text>
                <Text size="sm" c="gray.4" lh={1.5}>
                  {step.description}
                </Text>
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default SignUpToInsightSection;