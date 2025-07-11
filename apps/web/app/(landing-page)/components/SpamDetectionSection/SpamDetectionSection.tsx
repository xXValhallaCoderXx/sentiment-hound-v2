import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  Group,
} from "@mantine/core";
import {
  IconShield,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconEye,
} from "@tabler/icons-react";
import classes from "./SpamDetectionSection.module.css";

const SpamDetectionSection = () => {
  const detectionItems = [
    {
      username: "@fake_user_123",
      message: "This product actually sucks do not buy 🔥🔥🔥",
      status: "spam",
      icon: IconX,
      color: "#EF4444",
      badge: "SPAM",
      badgeColor: "#EF4444",
    },
    {
      username: "@real_customer",
      message: "Just tried this service, really impressed with the results!",
      status: "verified",
      icon: IconCheck,
      color: "#2ECC71", // Improved green for better contrast
      badge: "VERIFIED",
      badgeColor: "#2ECC71", // Improved green for better contrast
    },
    {
      username: "@suspicious_acc",
      message: "Buy fake likes and followers here...",
      status: "flagged",
      icon: IconAlertTriangle,
      color: "#F59E0B",
      badge: "FLAGGED",
      badgeColor: "#F59E0B",
    },
  ];

  const features = [
    {
      icon: IconShield,
      title: "Automated spam filtering",
      description: "Real-time detection of spam, bots, and fake accounts",
      color: "#2ECC71", // Improved green for better contrast
    },
    {
      icon: IconEye,
      title: "Manual review dashboard",
      description: "Review and customize filtering rules for your needs",
      color: "#3498DB", // Improved blue for better contrast
    },
    {
      icon: IconShield,
      title: "Continuous learning",
      description: "AI models improve accuracy over time with new data",
      color: "#9B59B6", // Improved purple for better contrast
    },
  ];

  const stats = [
    { label: "Processed", value: "1,234 posts" },
    { label: "Spam Blocked", value: "42%" },
    { label: "Accuracy", value: "99.2%" },
  ];

  return (
    <div>
      <Container size="xl">
        <Grid align="center" gutter="xl">
          <GridCol
            id="features"
            span={{ base: 12, lg: 6 }}
            order={{ base: 1, lg: 2 }}
          >
            <div className={classes.content}>
              <Badge
                leftSection={<IconShield size={16} />}
                size="lg"
                variant="light"
                mb={16}
              >
                Spam Detection
              </Badge>

              <Title order={2} className={classes.title}>
                Your team stays in the loop
              </Title>

              <Text className={classes.subtitle}>
                Advanced spam detection technology keeps your sentiment analysis
                clean and accurate. Our AI identifies fake accounts, bot
                activity, and irrelevant content with industry-leading
                precision.
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>

          <GridCol
            id="spam-img"
            span={{ base: 12, lg: 6 }}
            order={{ base: 2, lg: 1 }}
          >
            <div className={classes.detectionInterface}>
              <div className={classes.interfaceHeader}>
                <Group justify="space-between">
                  <Text className={classes.interfaceTitle}>
                    Spam Detection Engine
                  </Text>
                  <Badge className={classes.liveBadge} size="sm">
                    <span className={classes.liveDot}></span>
                    LIVE
                  </Badge>
                </Group>
                <Text className={classes.interfaceSubtitle}>
                  Real-time Analysis
                </Text>
              </div>

              <div className={classes.detectionFeed}>
                {detectionItems.map((item, index) => (
                  <div key={index} className={classes.detectionItem}>
                    <div className={classes.detectionHeader}>
                      <Text className={classes.username}>{item.username}</Text>
                      <Badge
                        className={classes.statusBadge}
                        style={{ backgroundColor: item.badgeColor }}
                        size="xs"
                      >
                        {item.badge}
                      </Badge>
                    </div>
                    <Text className={classes.message}>{item.message}</Text>
                    <div className={classes.detectionFooter}>
                      <item.icon size={16} color={item.color} />
                    </div>
                  </div>
                ))}
              </div>

              <div className={classes.statsContainer}>
                {stats.map((stat, index) => (
                  <div key={index} className={classes.statItem}>
                    <Text className={classes.statLabel}>{stat.label}</Text>
                    <Text className={classes.statValue}>{stat.value}</Text>
                  </div>
                ))}
              </div>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default SpamDetectionSection;
