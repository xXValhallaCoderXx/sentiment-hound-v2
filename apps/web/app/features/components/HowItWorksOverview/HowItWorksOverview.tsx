import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  ThemeIcon,
} from "@mantine/core";
import { IconPlug, IconTarget, IconChartLine } from "@tabler/icons-react";
import classes from "./HowItWorksOverview.module.css";

const HowItWorksOverview = () => {
  const steps = [
    {
      icon: IconPlug,
      title: "Connect Your Content",
      description:
        "Securely link your YouTube, Substack, or other platforms in just a few clicks.",
    },
    {
      icon: IconTarget,
      title: "Unleash the Hounds",
      description:
        "Our AI gets to work, sifting out spam and bots to accurately identify the true sentiment behind the words.",
    },
    {
      icon: IconChartLine,
      title: "Act with Confidence",
      description:
        "View everything on a single, unified dashboard and make smarter decisions with data you can trust.",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Title order={2} className={classes.title}>
            From Chaos to Clarity in Three Steps
          </Title>
        </div>

        <Grid gutter="xl" className={classes.grid}>
          {steps.map((step, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <div className={classes.card}>
                <div className={classes.iconWrapper}>
                  <ThemeIcon
                    size={48}
                    radius="md"
                    variant="light"
                    color="primary"
                    className={classes.icon}
                  >
                    <step.icon size={24} stroke={1.5} />
                  </ThemeIcon>
                </div>
                <Title order={3} className={classes.cardTitle}>
                  {step.title}
                </Title>
                <Text className={classes.cardDescription}>
                  {step.description}
                </Text>
              </div>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HowItWorksOverview;
