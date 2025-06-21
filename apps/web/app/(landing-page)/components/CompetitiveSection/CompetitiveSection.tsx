import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  ThemeIcon,
  Button,
  TextInput,
  Group,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconChartBar,
  IconUsers,
  IconTarget,
} from "@tabler/icons-react";
import classes from "./CompetitiveSection.module.css";

const CompetitiveSection = () => {
  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.header}>
          <Title order={2} className={classes.title} ta="center" c="text-primary">
            Competitor Comparison
          </Title>
          <Text className={classes.description} ta="center" mt="md" c="text-secondary">
            Side-by-side sentiment scores, shared keyword trends, and market mood analysis 
            to understand how your brand compares to competitors.
          </Text>
        </div>

        <Grid mt="xl" gutter="xl">
          <GridCol span={{ base: 12, md: 6 }}>
            <Box className={classes.featureCard}>
              <ThemeIcon
                size="lg"
                radius="md"
                color="blue"
                variant="light"
                mb="md"
              >
                <IconChartBar size={24} />
              </ThemeIcon>
              <Text fw={600} size="lg" c="text-primary" mb="sm">
                Side-by-side sentiment scores
              </Text>
              <Text size="sm" c="text-secondary">
                Compare your brand sentiment directly with competitors
              </Text>
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Box className={classes.featureCard}>
              <ThemeIcon
                size="lg"
                radius="md"
                color="teal"
                variant="light"
                mb="md"
              >
                <IconTrendingUp size={24} />
              </ThemeIcon>
              <Text fw={600} size="lg" c="text-primary" mb="sm">
                Shared keyword trends
              </Text>
              <Text size="sm" c="text-secondary">
                Track performance on keywords you both target
              </Text>
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Box className={classes.featureCard}>
              <ThemeIcon
                size="lg"
                radius="md"
                color="purple"
                variant="light"
                mb="md"
              >
                <IconUsers size={24} />
              </ThemeIcon>
              <Text fw={600} size="lg" c="text-primary" mb="sm">
                Market mood analysis
              </Text>
              <Text size="sm" c="text-secondary">
                Understand overall industry sentiment trends
              </Text>
            </Box>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Box className={classes.featureCard}>
              <ThemeIcon
                size="lg"
                radius="md"
                color="orange"
                variant="light"
                mb="md"
              >
                <IconTarget size={24} />
              </ThemeIcon>
              <Text fw={600} size="lg" c="white" mb="sm">
                Take a competitive ranking first look
              </Text>
              <Text size="sm" c="dimmed">
                Clear ranking dashboards give insights with your competitors
              </Text>
            </Box>
          </GridCol>
        </Grid>

        <Box className={classes.mockupContainer} mt="xl">
          <div className={classes.chartMockup}>
            <div className={classes.chartHeader}>
              <Text size="sm" c="white" fw={600}>
                Brand Sentiment Comparison
              </Text>
            </div>
            <div className={classes.chartContent}>
              <div className={classes.competitorBars}>
                <div className={classes.competitorRow}>
                  <Text size="xs" c="dimmed" className={classes.brandName}>
                    Your Brand
                  </Text>
                  <div className={classes.sentimentBar}>
                    <div
                      className={classes.barSegment}
                      style={{ width: "60%", backgroundColor: "#00d4aa" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "25%", backgroundColor: "#a0a0a0" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "15%", backgroundColor: "#ff6b7a" }}
                    ></div>
                  </div>
                  <Text size="xs" c="white" fw={600}>
                    85
                  </Text>
                </div>

                <div className={classes.competitorRow}>
                  <Text size="xs" c="dimmed" className={classes.brandName}>
                    Competitor A
                  </Text>
                  <div className={classes.sentimentBar}>
                    <div
                      className={classes.barSegment}
                      style={{ width: "45%", backgroundColor: "#00d4aa" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "35%", backgroundColor: "#a0a0a0" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "20%", backgroundColor: "#ff6b7a" }}
                    ></div>
                  </div>
                  <Text size="xs" c="dimmed">
                    72
                  </Text>
                </div>

                <div className={classes.competitorRow}>
                  <Text size="xs" c="dimmed" className={classes.brandName}>
                    Competitor B
                  </Text>
                  <div className={classes.sentimentBar}>
                    <div
                      className={classes.barSegment}
                      style={{ width: "40%", backgroundColor: "#00d4aa" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "30%", backgroundColor: "#a0a0a0" }}
                    ></div>
                    <div
                      className={classes.barSegment}
                      style={{ width: "30%", backgroundColor: "#ff6b7a" }}
                    ></div>
                  </div>
                  <Text size="xs" c="dimmed">
                    68
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Box>

        <Box ta="center" mt="xl">
          <Group justify="center" gap="md">
            <TextInput
              placeholder="Track 3 competitors"
              size="md"
              w={250}
              styles={{
                input: {
                  borderColor: 'light-dark(var(--mantine-color-ui-border-0), var(--mantine-color-ui-border-5))',
                }
              }}
            />
            <Button size="md" color="primary.5" c="white">
              Start Tracking
            </Button>
          </Group>
        </Box>
      </Container>
    </div>
  );
};

export default CompetitiveSection;
