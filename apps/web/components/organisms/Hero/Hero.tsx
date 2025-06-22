import {
  Container,
  Text,
  Button,
  Group,
  Box,
  Grid,
  GridCol,
  Title,
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
              <Title
                component="span"
                variant="gradient"
                c="primary"
                size={55}
                order={1}
                ml={-8}
              >
                Cut through the noise.
              </Title>
              <Title order={3} component="span" c="white">
                Fetch the insights your audience is hiding
              </Title>
              <Text className={classes.description} c="gray">
                Sentiment Hound turns comments, reviews, and social chatter into
                clear, ready-to-act insights—priced for creators, solo founders,
                and growing brands.
              </Text>

              <Group className={classes.controls} mt="xl">
                <Button
                  size="lg"
                  className={classes.control}
                  color="primary.5"
                  c="white"
                >
                  Early Access
                </Button>
                <Button
                  size="lg"
                  className={classes.controlSecondary}
                  variant="outline"
                  color="text-primary"
                  c="text-primary"
                >
                  See a Live Demo
                </Button>
              </Group>
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
