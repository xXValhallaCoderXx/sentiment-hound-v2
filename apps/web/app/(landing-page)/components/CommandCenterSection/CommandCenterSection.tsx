import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  Progress,
} from "@mantine/core";
import {
  IconBolt,
  IconTrendingUp,
  IconEye,
  IconChartDots3,
} from "@tabler/icons-react";
import classes from "./CommandCenterSection.module.css";

const CommandCenterSection = () => {
  const sentimentData = [
    { label: "Positive", value: 67, color: "#10B981" },
    { label: "Neutral", value: 21, color: "#6B7280" },
    { label: "Negative", value: 12, color: "#EF4444" },
  ];

  const features = [
    {
      icon: IconTrendingUp,
      title: "Real-time sentiment updates",
      description: "Live sentiment tracking across all channels",
      progress: 85,
      color: "#2ECC71", // Improved green for better contrast
    },
    {
      icon: IconEye,
      title: "Advanced keyword filtering",
      description: "Smart filters to focus on what matters most",
      progress: 92,
      color: "#3498DB", // Improved blue for better contrast
    },
    {
      icon: IconChartDots3,
      title: "Historical trend visualization",
      description: "Interactive charts showing sentiment patterns",
      progress: 78,
      color: "#9B59B6", // Improved purple for better contrast
    },
  ];

  const recentActivity = [
    "Positive spike detected on Reddit",
    "New keyword trend emerging",
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }}>
            <div>
              <Badge
                leftSection={<IconBolt size={16} />}
                size="lg"
                color="gray"
                variant="light"
                mb={16}
              >
                Command Center
              </Badge>

              <Title order={2} className={classes.title}>
                Your sentiment command center
              </Title>

              <Text className={classes.subtitle}>
                Monitor real-time sentiment across all your channels with
                powerful filtering, trend analysis, and actionable insights -
                all in one unified dashboard.
              </Text>

              <div className={classes.featureList}>
                {features.map((feature, index) => (
                  <div key={index} className={classes.featureItem}>
                    <div
                      className={classes.featureIcon}
                      style={{ backgroundColor: feature.color }}
                    >
                      <feature.icon size={20} stroke={1.5} color="white" />
                    </div>
                    <div className={classes.featureContent}>
                      <Text className={classes.featureTitle}>
                        {feature.title}
                      </Text>
                      <Text className={classes.featureDescription}>
                        {feature.description}
                      </Text>
                      <Progress
                        value={feature.progress}
                        color={feature.color}
                        size="sm"
                        className={classes.featureProgress}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>

          <GridCol span={{ base: 12, lg: 6 }}>
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
        </Grid>
      </Container>
    </div>
  );
};

export default CommandCenterSection;
