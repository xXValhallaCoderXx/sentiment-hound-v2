import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  ThemeIcon,
  Badge,
} from "@mantine/core";
import { IconShield, IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import classes from "./SpamDetectionSection.module.css";

const SpamDetectionSection = () => {
  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.mockupContainer}>
              <Box className={classes.mockupWindow}>
                <div className={classes.windowHeader}>
                  <div className={classes.windowControls}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <Text size="sm" c="white" ml="auto">
                    Spam Detection
                  </Text>
                </div>
                <div className={classes.detectionContent}>
                  <div className={classes.detectionItem}>
                    <div className={classes.detectionHeader}>
                      <ThemeIcon size="sm" color="red" variant="light">
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="white">
                        @fake_user_123
                      </Text>
                      <Badge size="xs" color="red" variant="light">
                        SPAM
                      </Badge>
                    </div>
                    <Text size="xs" c="dimmed" mt="xs">
                      This product actually sucks do not buy 🔥🔥🔥
                    </Text>
                  </div>

                  <div className={classes.detectionItem}>
                    <div className={classes.detectionHeader}>
                      <ThemeIcon size="sm" color="green" variant="light">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="white">
                        @real_customer
                      </Text>
                      <Badge size="xs" color="green" variant="light">
                        VERIFIED
                      </Badge>
                    </div>
                    <Text size="xs" c="dimmed" mt="xs">
                      Just tried this service, really impressed with the
                      results!
                    </Text>
                  </div>

                  <div className={classes.detectionItem}>
                    <div className={classes.detectionHeader}>
                      <ThemeIcon size="sm" color="yellow" variant="light">
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="white">
                        @suspicious_acc
                      </Text>
                      <Badge size="xs" color="yellow" variant="light">
                        FLAGGED
                      </Badge>
                    </div>
                    <Text size="xs" c="dimmed" mt="xs">
                      Buy fake likes and followers here...
                    </Text>
                  </div>
                </div>
                <div className={classes.stats}>
                  <Text size="xs" c="dimmed">
                    Processed: 1,234 posts
                  </Text>
                  <Text size="xs" c="dimmed">
                    Spam blocked: 42%
                  </Text>
                </div>
              </Box>
            </div>
          </GridCol>
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.content}>
              <Badge
                size="lg"
                color="red"
                variant="light"
                className={classes.badge}
              >
                SPAM DETECTION
              </Badge>
              <Title order={2} className={classes.title} mt="md">
                Your team stays{" "}
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: "#ff4757", to: "#ff6b7a" }}
                  inherit
                >
                  in the loop
                </Text>
              </Title>
              <Text className={classes.description} mt="md">
                With advanced spam detection, your team can confidently analyze
                real sentiment. So you can put AI to work, knowing you&apos;re
                always in control.
              </Text>

              <Box className={classes.features} mt="xl">
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="teal" variant="light">
                    <IconShield size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Automatically prioritize
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="blue" variant="light">
                    <IconCheck size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Assign team members
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon
                    size="sm"
                    radius="md"
                    color="yellow"
                    variant="light"
                  >
                    <IconAlertTriangle size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Instantly in-line and insight
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="red" variant="light">
                    <IconShield size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm">
                    Manually control
                  </Text>
                </div>
              </Box>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default SpamDetectionSection;
