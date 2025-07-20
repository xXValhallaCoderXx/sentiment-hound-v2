import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Badge,
  List,
  ListItem,
} from "@mantine/core";
import { IconTrendingUp, IconCheck } from "@tabler/icons-react";
import classes from "./CompetitorAnalysisFeature.module.css";

const CompetitorAnalysisFeature = () => {
  const features = [
    "Lorem ipsum dolor sit amet",
    "Consectetur adipiscing elit",
    "Sed do eiusmod tempor incididunt",
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl">
        <Grid align="center" gutter="xl">
          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 2, lg: 1 }}>
            <div className={classes.placeholder}>
              <div className={classes.placeholderContent}>
                <div className={classes.placeholderIcon}>
                  <IconTrendingUp size={48} stroke={1.5} />
                </div>
                <Text className={classes.placeholderText}>
                  Competitor Analysis Feature
                </Text>
                <Text className={classes.placeholderSubtext}>Coming Soon</Text>
              </div>
            </div>
          </GridCol>

          <GridCol span={{ base: 12, lg: 6 }} order={{ base: 1, lg: 2 }}>
            <div className={classes.content}>
              <Badge
                leftSection={<IconTrendingUp size={16} />}
                size="lg"
                color="gray"
                variant="light"
                mb={16}
                className={classes.badge}
              >
                COMPETITOR ANALYSIS
              </Badge>

              <Title order={2} className={classes.title}>
                Track the Landscape
              </Title>

              <Text className={classes.subtitle}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris.
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
        </Grid>
      </Container>
    </div>
  );
};

export default CompetitorAnalysisFeature;
