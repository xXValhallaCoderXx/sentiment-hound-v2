import {
  Container,
  Text,
  Button,
  Group,
  Box,
  Grid,
  GridCol,
} from "@mantine/core";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.backgroundPattern}></div>
      <Container size={1400} className={classes.inner}>
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.content}>
              <h1 className={classes.title}>
                Cut through the noise.{" "}
                <Text
                  component="span"
                  variant="gradient"
                  gradient={{ from: "#ff4757", to: "#ff6b7a" }}
                  inherit
                >
                  Hear what your audience truly feels.
                </Text>
              </h1>
              <Text className={classes.description} c="dimmed">
                Sentiment Hound helps you instantly understand brand perception
                across platforms like Twitter, Reddit, and more — all powered by
                intelligent sentiment analysis and noise filtering.
              </Text>

              <Group className={classes.controls} mt="xl">
                <Button
                  size="lg"
                  className={classes.control}
                  color="red"
                  style={{ backgroundColor: "#ff4757" }}
                >
                  Get Started Free
                </Button>
                <Button
                  size="lg"
                  className={classes.controlSecondary}
                  variant="subtle"
                  c="white"
                >
                  See a Live Demo
                </Button>
              </Group>

              <Box className={classes.trustedBy} mt="xl">
                <Text c="dimmed" size="sm" mb="md">
                  Trusted by modern brands and agile teams
                </Text>
                <Group gap="xl" className={classes.brandLogos}>
                  <Text c="dimmed" fw={600} size="sm">
                    ACME
                  </Text>
                  <Text c="dimmed" fw={600} size="sm">
                    BRAND
                  </Text>
                  <Text c="dimmed" fw={600} size="sm">
                    TECHCO
                  </Text>
                  <Text c="dimmed" fw={600} size="sm">
                    STARTUP
                  </Text>
                  <Text c="dimmed" fw={600} size="sm">
                    COMPANY
                  </Text>
                </Group>
              </Box>
            </div>
          </GridCol>
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.dashboardPreview}>
              <Box className={classes.mockupContainer}>
                <div className={classes.mockupWindow}>
                  <div className={classes.windowBar}>
                    <div className={classes.windowControls}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className={classes.dashboardContent}>
                    <div className={classes.chartContainer}>
                      <div className={classes.chartHeader}>
                        <Text size="sm" c="white">
                          Sentiment Overview
                        </Text>
                      </div>
                      <div className={classes.barChart}>
                        <div
                          className={classes.bar}
                          style={{ height: "60%", backgroundColor: "#00d4aa" }}
                        ></div>
                        <div
                          className={classes.bar}
                          style={{ height: "80%", backgroundColor: "#5f27cd" }}
                        ></div>
                        <div
                          className={classes.bar}
                          style={{ height: "45%", backgroundColor: "#ff9ff3" }}
                        ></div>
                        <div
                          className={classes.bar}
                          style={{ height: "90%", backgroundColor: "#54a0ff" }}
                        ></div>
                        <div
                          className={classes.bar}
                          style={{ height: "70%", backgroundColor: "#ff6b7a" }}
                        ></div>
                        <div
                          className={classes.bar}
                          style={{ height: "85%", backgroundColor: "#feca57" }}
                        ></div>
                      </div>
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

export default Hero;
