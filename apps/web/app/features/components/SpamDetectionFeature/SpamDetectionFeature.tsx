import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  Group,
  List,
  ListItem,
} from "@mantine/core";
import {
  IconShield,
  IconCheck,
  IconX,
  IconAlertTriangle,
} from "@tabler/icons-react";
import classes from "./SpamDetectionFeature.module.css";

const SpamDetectionFeature = () => {
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
      color: "#2ECC71",
      badge: "VERIFIED",
      badgeColor: "#2ECC71",
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
    "Automated spam filtering",
    "Manual review dashboard",
    "Continuous learning",
  ];

  const stats = [
    { label: "Processed", value: "1,234 posts" },
    { label: "Spam Blocked", value: "42%" },
    { label: "Accuracy", value: "99.2%" },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 1, lg: 1 }}>
            <div className={classes.content}>
              <Badge
                leftSection={<IconShield size={16} />}
                size="lg"
                variant="light"
                mb={16}
                className={classes.badge}
              >
                SPAM DETECTION
              </Badge>

              <Title order={2} className={classes.title}>
                Your team stays in the loop.
              </Title>

              <Text className={classes.subtitle}>
                Advanced spam detection technology keeps your sentiment analysis
                clean and accurate. Our AI identifies fake accounts, bot
                activity, and irrelevant content with industry-leading
                precision.
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

          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 2, lg: 2 }}>
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

export default SpamDetectionFeature;
