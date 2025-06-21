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
  IconTrendingUp,
  IconAlertCircle,
  IconUsers,
} from "@tabler/icons-react";
import classes from "./CommandCenterSection.module.css";

const CommandCenterSection = () => {
  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }}>
            <div>
              <Title order={2} className={classes.title} c="text-primary">
                Sentiment Command Center
              </Title>
              <Text className={classes.description} mt="md" c="text-secondary">
                Real-time sentiment updates, keyword filtering, and historical 
                trend visualization all in one powerful dashboard.
              </Text>

              <Box className={classes.features} mt="xl">
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="success" variant="light">
                    <IconTrendingUp size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Real-time sentiment updates
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon
                    size="sm"
                    radius="md"
                    color="warning"
                    variant="light"
                  >
                    <IconAlertCircle size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Keyword filtering
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="info" variant="light">
                    <IconUsers size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Historical trend visualization
                  </Text>
                </div>
              </Box>
            </div>
          </GridCol>
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.dashboardMockup}>
              <Box className={classes.mockupWindow}>
                <div className={classes.windowHeader}>
                  <div className={classes.windowControls}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className={classes.dashboardContent}>
                  <div className={classes.chartArea}>
                    <div className={classes.lineChart}>
                      <svg viewBox="0 0 400 200" className={classes.chartSvg}>
                        <polyline
                          points="0,150 50,120 100,140 150,110 200,130 250,100 300,90 350,85 400,80"
                          fill="none"
                          stroke="#00d4aa"
                          strokeWidth="3"
                        />
                        <polyline
                          points="0,180 50,160 100,170 150,145 200,160 250,140 300,135 350,130 400,125"
                          fill="none"
                          stroke="#ff6b7a"
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className={classes.statsGrid}>
                    <div className={classes.statCard}>
                      <Text size="xs" c="dimmed">
                        Positive
                      </Text>
                      <Text size="lg" fw={700} c="teal">
                        67%
                      </Text>
                    </div>
                    <div className={classes.statCard}>
                      <Text size="xs" c="dimmed">
                        Neutral
                      </Text>
                      <Text size="lg" fw={700} c="gray">
                        24%
                      </Text>
                    </div>
                    <div className={classes.statCard}>
                      <Text size="xs" c="dimmed">
                        Negative
                      </Text>
                      <Text size="lg" fw={700} c="red">
                        9%
                      </Text>
                    </div>
                  </div>
                </div>
              </Box>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default CommandCenterSection;
