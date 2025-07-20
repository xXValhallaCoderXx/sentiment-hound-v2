import {
  Container,
  Text,
  Button,
  Group,
  Grid,
  GridCol,
  Title,
} from "@mantine/core";
import Image from "next/image";
import classes from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={classes.wrapper}>
      <Container size={1400} className={classes.inner}>
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }}>
            <div className={classes.content}>
              <Title
                component="span"
                variant="gradient"
                className={classes.mainTitle}
                size={55}
                order={1}
                ml={-8}
              >
                Cut through the noise.
              </Title>
              <Title order={3} component="span" className={classes.subtitle}>
                Fetch the insights your audience is hiding
              </Title>
              <Text className={classes.description}>
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
            <Image
              alt="img-logo"
              src="/images/content/sentiment-hound-social.png"
              layout="responsive"
              width={700}
              height={500}
            />
          </GridCol>
        </Grid>
      </Container>
    </div>
  );
};

export default Hero;
