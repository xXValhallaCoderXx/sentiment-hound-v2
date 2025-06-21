import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  ThemeIcon,
  Badge,
  Group,
  Button,
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
                      <ThemeIcon size="sm" color="error" variant="light">
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="text-primary">
                        @fake_user_123
                      </Text>
                      <Badge size="xs" color="error" variant="light">
                        SPAM
                      </Badge>
                    </div>
                    <Text size="xs" c="dimmed" mt="xs">
                      This product actually sucks do not buy 🔥🔥🔥
                    </Text>
                  </div>

                  <div className={classes.detectionItem}>
                    <div className={classes.detectionHeader}>
                      <ThemeIcon size="sm" color="success" variant="light">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="text-primary">
                        @real_customer
                      </Text>
                      <Badge size="xs" color="success" variant="light">
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
                      <ThemeIcon size="sm" color="warning" variant="light">
                        <IconAlertTriangle size={14} />
                      </ThemeIcon>
                      <Text size="sm" c="text-primary">
                        @suspicious_acc
                      </Text>
                      <Badge size="xs" color="warning" variant="light">
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
                color="primary.5"
                variant="light"
                className={classes.badge}
              >
                Advanced Filtering
              </Badge>
              <Title order={2} className={classes.title} mt="md" c="text-primary">
                Spam Detection & Team Controls
              </Title>
              <Text className={classes.description} mt="md" c="text-secondary">
                Automatically prioritize with AI, assign team roles, 
                approve/decline comments with manual prompt fallback.
              </Text>

              <Box className={classes.features} mt="xl">
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="success" variant="light">
                    <IconShield size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Automatically prioritize with AI
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="info" variant="light">
                    <IconCheck size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Assign team roles
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon
                    size="sm"
                    radius="md"
                    color="warning"
                    variant="light"
                  >
                    <IconAlertTriangle size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Approve/decline comments
                  </Text>
                </div>
                <div className={classes.feature}>
                  <ThemeIcon size="sm" radius="md" color="primary" variant="light">
                    <IconShield size={16} />
                  </ThemeIcon>
                  <Text size="sm" ml="sm" c="text-primary">
                    Manual prompt fallback
                  </Text>
                </div>
              </Box>

              <Group mt="xl" gap="md">
                <Button
                  size="md"
                  color="primary.5"
                  c="white"
                >
                  Try for Free
                </Button>
                <Button
                  size="md"
                  variant="outline"
                  color="text-primary"
                  c="text-primary"
                >
                  Watch Demo
                </Button>
              </Group>
            </div>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default SpamDetectionSection;
