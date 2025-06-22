import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  Button,
  Group,
} from "@mantine/core";
import {
  IconTrendingUp,
  IconChartBar,
  IconUsers,
  IconTarget,
  IconVs,
  IconRocket,
} from "@tabler/icons-react";
import classes from "./CompetitiveSection.module.css";

const CompetitiveSection = () => {
  const features = [
    {
      icon: IconChartBar,
      title: "Side-by-side sentiment scores",
      description:
        "Compare your brand sentiment directly with competitors in real-time dashboards",
      color: "#3B82F6",
    },
    {
      icon: IconTrendingUp,
      title: "Shared keyword trends",
      description:
        "Track performance on keywords you both target and discover new opportunities",
      color: "#10B981",
    },
    {
      icon: IconUsers,
      title: "Market mood analysis",
      description:
        "Understand overall industry sentiment trends and market positioning",
      color: "#8B5CF6",
    },
    {
      icon: IconTarget,
      title: "Competitive intelligence",
      description:
        "Get alerts when competitors gain or lose sentiment momentum",
      color: "#F59E0B",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.header}>
          <Badge className={classes.badge} size="lg" variant="light">
            <IconVs size={16} />
            Competitive Analysis
          </Badge>

          <Title order={2} className={classes.title}>
            See how you stack up
          </Title>

          <Text className={classes.subtitle}>
            Get comprehensive competitor analysis with side-by-side sentiment
            comparison, shared keyword tracking, and market positioning
            insights.
          </Text>
        </div>

        <div className={classes.visualSection}>
          <div className={classes.comparisonMockup}>
            <div className={classes.mockupHeader}>
              <Text size="sm" fw={600} className={classes.mockupTitle}>
                Brand Sentiment Comparison
              </Text>
            </div>

            <div className={classes.mockupContent}>
              <div className={classes.brandComparison}>
                <div className={classes.brandItem}>
                  <div className={classes.brandInfo}>
                    <div
                      className={classes.brandAvatar}
                      style={{ backgroundColor: "#10B981" }}
                    >
                      YB
                    </div>
                    <Text size="sm" className={classes.brandName}>
                      Your Brand
                    </Text>
                  </div>
                  <div className={classes.sentimentScore}>
                    <Text size="xl" fw={700} style={{ color: "#10B981" }}>
                      67%
                    </Text>
                    <Text size="xs" className={classes.scoreLabel}>
                      Positive
                    </Text>
                  </div>
                </div>

                <div className={classes.vsIndicator}>
                  <IconVs size={20} color="rgba(255, 255, 255, 0.5)" />
                </div>

                <div className={classes.brandItem}>
                  <div className={classes.brandInfo}>
                    <div
                      className={classes.brandAvatar}
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      C1
                    </div>
                    <Text size="sm" className={classes.brandName}>
                      Competitor 1
                    </Text>
                  </div>
                  <div className={classes.sentimentScore}>
                    <Text size="xl" fw={700} style={{ color: "#EF4444" }}>
                      43%
                    </Text>
                    <Text size="xs" className={classes.scoreLabel}>
                      Positive
                    </Text>
                  </div>
                </div>
              </div>

              <div className={classes.trendChart}>
                <svg viewBox="0 0 300 100" className={classes.chartSvg}>
                  <polyline
                    points="0,70 50,65 100,60 150,55 200,50 250,45 300,40"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="3"
                  />
                  <polyline
                    points="0,80 50,85 100,82 150,78 200,75 250,73 300,70"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <Grid className={classes.featuresGrid} gutter="xl">
          {features.map((feature, index) => (
            <GridCol key={index} span={{ base: 12, md: 6 }}>
              <div className={classes.featureCard}>
                <div
                  className={classes.featureIcon}
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon size={24} color="white" stroke={1.5} />
                </div>
                <div className={classes.featureContent}>
                  <Text className={classes.featureTitle}>{feature.title}</Text>
                  <Text className={classes.featureDescription}>
                    {feature.description}
                  </Text>
                </div>
              </div>
            </GridCol>
          ))}
        </Grid>

        <Group justify="center" className={classes.ctaGroup}>
          <Button
            size="lg"
            className={classes.ctaButton}
            leftSection={<IconRocket size={20} />}
          >
            Compare Your Brand
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default CompetitiveSection;
