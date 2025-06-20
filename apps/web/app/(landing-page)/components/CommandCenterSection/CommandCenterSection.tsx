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
              <Title order={2} className={classes.title}>
                Your sentiment command center
              </Title>
              <Text className={classes.description} mt="md">
                See the full story behind your mentions in a single dashboard
                where you live sentiment scores, trends, and filtered mentions —
                all in one place.
              </Text>

              <Box className={classes.features} mt="xl">
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="teal" variant="light">
                    <IconTrendingUp size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Real-time sentiment updates
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon
                    size="sm"
                    radius="md"
                    color="yellow"
                    variant="light"
                  >
                    <IconAlertCircle size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Advanced filtering and flagging
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="blue" variant="light">
                    <IconUsers size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Historical trend visualizations
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
