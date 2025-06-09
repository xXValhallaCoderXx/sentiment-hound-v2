import {
  Title,
  Text,
  Container,
  Grid,
  GridCol,
  Card,
  Group,
  ThemeIcon,
  Box,
} from "@mantine/core";
import {
  IconMessageSearch,
  IconChartDonut3,
  IconAspectRatio,
  IconTrendingUp,
  IconShield,
  IconBolt,
} from "@tabler/icons-react";
import classes from "./MainFeatures.module.css";

const MainFeaturesSection = () => {
  return (
    <div className={classes.mainFeatureWrapper}>
      <Container size="xl" py="xl">
        <Title order={2} className={classes.title} ta="center" mt="sm">
          Turn Chaos into Clarity
        </Title>

        <Text c="dimmed" className={classes.description} ta="center" mt="md">
          Stop drowning in feedback data. Start making confident decisions 
          with insights that matter.
        </Text>

        {/* Bento Grid Layout */}
        <Grid mt={50} gutter="md" className={classes.bentoGrid}>
          {/* Large feature - spans 2 columns */}
          <GridCol span={{ base: 12, md: 8 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardLarge}`} 
              padding="xl"
              radius="lg"
            >
              <Group gap="md" mb="md">
                <ThemeIcon 
                  size={60} 
                  radius="md" 
                  variant="light"
                  color="primary"
                >
                  <IconMessageSearch size={32} stroke={1.5} />
                </ThemeIcon>
                <Box>
                  <Text fw={700} fz="xl" mb={4}>
                    Real-time Sentiment Detection
                  </Text>
                  <Text c="dimmed" fz="md">
                    Monitor customer sentiment as it happens across all your channels
                  </Text>
                </Box>
              </Group>
              <Text c="dimmed" fz="sm" mt="md">
                Get instant insights from customer feedback across social media, 
                reviews, support tickets, and more. Our AI processes sentiment 
                in real-time, alerting you to important changes as they happen.
              </Text>
            </Card>
          </GridCol>

          {/* Medium feature */}
          <GridCol span={{ base: 12, md: 4 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardMedium}`} 
              padding="lg"
              radius="lg"
            >
              <ThemeIcon 
                size={50} 
                radius="md" 
                variant="light"
                color="secondary"
                mb="md"
              >
                <IconChartDonut3 size={26} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} fz="lg" mb={8}>
                Historical Insights
              </Text>
              <Text c="dimmed" fz="sm">
                Track sentiment trends over time
              </Text>
            </Card>
          </GridCol>

          {/* Two small features */}
          <GridCol span={{ base: 12, sm: 6, md: 3 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardSmall}`} 
              padding="md"
              radius="lg"
            >
              <ThemeIcon 
                size={40} 
                radius="md" 
                variant="light"
                color="accent"
                mb="sm"
              >
                <IconTrendingUp size={22} stroke={1.5} />
              </ThemeIcon>
              <Text fw={600} fz="md" mb={6}>
                Performance Metrics
              </Text>
              <Text c="dimmed" fz="xs">
                Track your progress with detailed analytics
              </Text>
            </Card>
          </GridCol>

          <GridCol span={{ base: 12, sm: 6, md: 3 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardSmall}`} 
              padding="md"
              radius="lg"
            >
              <ThemeIcon 
                size={40} 
                radius="md" 
                variant="light"
                color="success"
                mb="sm"
              >
                <IconShield size={22} stroke={1.5} />
              </ThemeIcon>
              <Text fw={600} fz="md" mb={6}>
                Secure & Private
              </Text>
              <Text c="dimmed" fz="xs">
                Enterprise-grade security for your data
              </Text>
            </Card>
          </GridCol>

          {/* Medium feature and Aspect Analysis */}
          <GridCol span={{ base: 12, md: 6 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardMedium}`} 
              padding="lg"
              radius="lg"
            >
              <ThemeIcon 
                size={50} 
                radius="md" 
                variant="light"
                color="warning"
                mb="md"
              >
                <IconBolt size={26} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} fz="lg" mb={8}>
                Lightning Fast
              </Text>
              <Text c="dimmed" fz="sm">
                Process millions of data points instantly
              </Text>
            </Card>
          </GridCol>

          <GridCol span={{ base: 12, md: 6 }}>
            <Card 
              className={`${classes.bentoCard} ${classes.bentoCardMedium}`} 
              padding="lg"
              radius="lg"
            >
              <ThemeIcon 
                size={50} 
                radius="md" 
                variant="light"
                color="error"
                mb="md"
              >
                <IconAspectRatio size={26} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} fz="lg" mb={8}>
                Aspect Analysis
              </Text>
              <Text c="dimmed" fz="sm">
                Understand what drives sentiment
              </Text>
            </Card>
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default MainFeaturesSection;
