import { Container, Title, Text } from "@mantine/core";
import classes from "./FeaturesHero.module.css";

const FeaturesHero = () => {
  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.container}>
        <div className={classes.content}>
          <Title order={1} className={classes.title}>
            All The Power, None of the Noise.
          </Title>
          <Text className={classes.subtitle}>
            Explore the core features that transform raw data into clear,
            actionable business intelligence.
          </Text>
        </div>
      </Container>
    </div>
  );
};

export default FeaturesHero;
