import {
  Container,
  Title,
  Text,
  Grid,
  GridCol,
  Box,
  Button,
  List,
  ListItem,
  Badge,
} from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import classes from "./PricingSection.module.css";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/mo",
      description: "Great for testing the waters",
      features: [
        "Up to 100 mentions",
        "2,500 scans per month",
        "Basic sentiment analysis",
        "7 days historical data",
      ],
      buttonText: "Choose Plan",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      description: "For growing brands",
      features: [
        "Up to 10,000 mentions",
        "Unlimited scans per month",
        "Advanced filtering and flagging",
        "30 days historical data",
      ],
      buttonText: "Choose Plan",
      buttonVariant: "filled" as const,
      popular: true,
    },
    {
      name: "Premium",
      price: "Custom",
      period: "",
      description: "For enterprise brands",
      features: [
        "Unlimited brands",
        "Priority support and training",
        "Custom integrations",
        "Full historical access",
      ],
      buttonText: "Choose Plan",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.header}>
          <Title order={2} className={classes.title} ta="center">
            Plans for every stage
          </Title>
        </div>

        <Grid mt="xl" gutter="xl" justify="center">
          {plans.map((plan, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Box
                className={`${classes.planCard} ${plan.popular ? classes.popularCard : ""}`}
              >
                {plan.popular && (
                  <Badge className={classes.popularBadge} color="red">
                    MOST POPULAR
                  </Badge>
                )}

                <div className={classes.planHeader}>
                  <Text className={classes.planName} fw={600}>
                    {plan.name}
                  </Text>
                  <div className={classes.priceWrapper}>
                    <Text className={classes.price}>{plan.price}</Text>
                    <Text className={classes.period} c="dimmed">
                      {plan.period}
                    </Text>
                  </div>
                  <Text
                    className={classes.planDescription}
                    c="dimmed"
                    size="sm"
                  >
                    {plan.description}
                  </Text>
                </div>

                <List className={classes.featureList} spacing="sm" mt="lg">
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} className={classes.feature}>
                      <div className={classes.featureContent}>
                        <IconCheck size={16} className={classes.checkIcon} />
                        <Text size="sm">{feature}</Text>
                      </div>
                    </ListItem>
                  ))}
                </List>

                <Button
                  className={classes.planButton}
                  variant={plan.buttonVariant}
                  color={plan.popular ? "red" : "gray"}
                  size="md"
                  fullWidth
                  mt="xl"
                  style={
                    plan.popular ? { backgroundColor: "#ff4757" } : undefined
                  }
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default PricingSection;
