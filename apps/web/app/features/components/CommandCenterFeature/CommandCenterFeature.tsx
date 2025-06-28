import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  Progress,
  List,
  ListItem,
} from "@mantine/core";
import {
  IconBolt,
  IconTrendingUp,
  IconEye,
  IconChartDots3,
  IconCheck,
} from "@tabler/icons-react";
import classes from "./CommandCenterFeature.module.css";

const CommandCenterFeature = () => {
  const sentimentData = [
    { label: "Positive", value: 67, color: "#10B981" },
    { label: "Neutral", value: 21, color: "#6B7280" },
    { label: "Negative", value: 12, color: "#EF4444" },
  ];

  const features = [
    "Real-time sentiment updates",
    "Advanced keyword filtering", 
    "Historical trend visualization",
  ];

  const recentActivity = [
    "Positive spike detected on Reddit",
    "New keyword trend emerging",
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 2, lg: 1 }}>
            <div className={classes.dashboard}>
              <div className={classes.dashboardHeader}>
                <Text className={classes.dashboardTitle}>
                  Sentiment Dashboard
                </Text>
              </div>

              <div className={classes.sentimentStats}>
                {sentimentData.map((item, index) => (
                  <div key={index} className={classes.sentimentItem}>
                    <Text className={classes.sentimentLabel}>{item.label}</Text>
                    <Text
                      className={classes.sentimentValue}
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </Text>
                  </div>
                ))}
              </div>

              <div className={classes.chartContainer}>
                <svg className={classes.trendChart} viewBox="0 0 300 120">
                  <defs>
                    <linearGradient
                      id="positiveGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient
                      id="negativeGradient"
                      x1="0%"
                      y1="0%"
                      x2="0%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Positive trend line */}
                  <path
                    d="M 20 80 Q 60 60 100 50 T 180 40 Q 220 35 260 30"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2"
                    className={classes.trendLine}
                  />
                  <path
                    d="M 20 80 Q 60 60 100 50 T 180 40 Q 220 35 260 30 L 260 120 L 20 120 Z"
                    fill="url(#positiveGradient)"
                  />

                  {/* Negative trend line */}
                  <path
                    d="M 20 90 Q 60 85 100 80 T 180 75 Q 220 78 260 85"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    className={classes.trendLine}
                  />
                  <path
                    d="M 20 90 Q 60 85 100 80 T 180 75 Q 220 78 260 85 L 260 120 L 20 120 Z"
                    fill="url(#negativeGradient)"
                  />
                </svg>
              </div>

              <div className={classes.activityFeed}>
                <Text className={classes.activityTitle}>Recent Activity</Text>
                {recentActivity.map((activity, index) => (
                  <Text key={index} className={classes.activityItem}>
                    {activity}
                  </Text>
                ))}
              </div>
            </div>
          </GridCol>

          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 1, lg: 2 }}>
            <div className={classes.content}>
              <Badge
                leftSection={<IconBolt size={16} />}
                size="lg"
                color="gray"
                variant="light"
                mb={16}
                className={classes.badge}
              >
                COMMAND CENTER
              </Badge>

              <Title order={2} className={classes.title}>
                Your sentiment command center.
              </Title>

              <Text className={classes.subtitle}>
                Monitor real-time sentiment across all your channels with
                powerful filtering, trend analysis, and actionable insights -
                all in one unified dashboard.
              </Text>

              <List className={classes.featureList} spacing="sm" mt="lg">
                {features.map((feature, index) => (
                  <ListItem key={index} className={classes.feature}>
                    <div className={classes.featureContent}>
                      <IconCheck size={16} className={classes.checkIcon} />
                      <Text size="sm">{feature}</Text>
                    </div>
                  </ListItem>
                ))}
              </List>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default CommandCenterFeature;