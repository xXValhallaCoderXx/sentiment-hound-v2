import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  ThemeIcon,
  Button,
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
          <Title order={2} className={classes.title} ta="center">
            See how you stack up
          </Title>
          <Text className={classes.description} ta="center" mt="md">
            Benchmark your brand against competitors and real-time sentiment
            comparisons. Spot trends, track performance clearly.
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
              <Text fw={600} size="lg" c="white" mb="sm">
                Side-by-side sentiment trends
              </Text>
              <Text size="sm" c="dimmed">
                Track brand vs competitor sentiment over time, clearly see
                impact
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
              <Text fw={600} size="lg" c="white" mb="sm">
                Speed beyond benchmarks
              </Text>
              <Text size="sm" c="dimmed">
                Identify trending keywords and sentiment shifts in real-time
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
              <Text fw={600} size="lg" c="white" mb="sm">
                Market trend analysis
              </Text>
              <Text size="sm" c="dimmed">
                Spot industry trends, track performance alongside major events
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
          <Button size="lg" color="red" style={{ backgroundColor: "#ff4757" }}>
            Take a competitive ranking first look
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default CompetitiveSection;
