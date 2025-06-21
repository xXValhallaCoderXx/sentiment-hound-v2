import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Card,
  ThemeIcon,
  Group,
} from "@mantine/core";
import {
  IconShieldCheck,
  IconEye,
  IconBrain,
} from "@tabler/icons-react";
import classes from "./WhyTeamsLoveSection.module.css";

const WhyTeamsLoveSection = () => {
  const features = [
    {
      icon: IconShieldCheck,
      title: "Noise-free insights",
      description: "Spam & bots filtered with precision",
      color: "success",
    },
    {
      icon: IconEye,
      title: "Built for clarity",
      description: "Dashboards made for action, not just observation",
      color: "info",
    },
    {
      icon: IconBrain,
      title: "AI-powered decisions",
      description: "Understand what your audience truly thinks",
      color: "primary",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" py="xl">
        <Title order={2} className={classes.title} ta="center" c="text-primary">
          Why Teams Love Using Sentiment Hound
        </Title>

        <Grid mt="xl" gutter="xl">
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Card 
                className={classes.featureCard}
                padding="xl"
                radius="md"
              >
                <Group gap="md" mb="md">
                  <ThemeIcon
                    size={50}
                    radius="md"
                    variant="light"
                    color={feature.color}
                  >
                    <feature.icon size={24} stroke={1.5} />
                  </ThemeIcon>
                </Group>
                <Text fw={700} size="lg" mb="sm" c="text-primary">
                  {feature.title}
                </Text>
                <Text c="text-secondary" size="sm" lh={1.6}>
                  {feature.description}
                </Text>
              </Card>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default WhyTeamsLoveSection;