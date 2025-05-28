import { Container, Text, Button, Group, Stack, Box } from "@mantine/core";
import { IconChartPie, IconArrowRight } from "@tabler/icons-react";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={classes.wrapper}>
      <div className={classes.background}></div>
      <Container size={1100} className={classes.inner}>
        <div className={classes.content}>
          <Stack spacing="xl">
            <h1 className={classes.title}>
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                inherit
              >
                Transforming Data
              </Text>
              <br />
              Into Actionable Insights
            </h1>
            
            <Text className={classes.description} color="dimmed">
              <span className={classes.highlight}>Sentiment Hound</span> delivers powerful 
              sentiment analysis for modern businesses. Unlock valuable insights from customer feedback 
              and make data-driven decisions with confidence.
            </Text>

            <Group className={classes.controls}>
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                rightSection={<IconArrowRight size={20} />}
              >
                Get early access
              </Button>
              
              <Button
                size="xl"
                className={classes.secondaryControl}
                variant="outline"
                leftSection={<IconChartPie size={20} />}
              >
                See how it works
              </Button>
            </Group>
            
            <Text ta="center" className={classes.featuredBanner}>
              Used by innovative teams at <Text component="span" fw={700}>Acme</Text>, <Text component="span" fw={700}>Globex</Text> & <Text component="span" fw={700}>Stark Industries</Text>
            </Text>
          </Stack>
        </div>
      </Container>
    </div>
  );
};

export default Hero;
