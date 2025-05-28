import { Container, Text, Button, Group } from "@mantine/core";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={classes.wrapper}>
      <Container size={1020} className={classes.inner}>
        <h1 className={classes.title}>
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
            inherit
          >
            Sentiment Analysis
          </Text>
          <br />
          Made Easy
        </h1>
        <Text className={classes.description} color="dimmed">
          <span>Sentiment</span> Hound delivers cost-effective sentiment
          analysis at your fingertips, ensuring that no one is left behind in
          the quest for data-driven success
        </Text>

        <Group className={classes.controls}>
          <Button
            size="xl"
            className={classes.control}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan" }}
          >
            Get early access
          </Button>
        </Group>
      </Container>
    </div>
  );
};

export default Hero;
