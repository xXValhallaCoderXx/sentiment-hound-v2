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
      description: "For testers",
      features: [
        "Basic sentiment analysis",
        "Limited mentions tracking",
        "7-day data history",
        "Email support",
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/mo",
      description: "For growing brands",
      features: [
        "Advanced sentiment analysis",
        "Unlimited mentions",
        "Competitor tracking",
        "Real-time alerts",
        "30-day data history",
        "Priority support",
      ],
      buttonText: "Choose Pro",
      buttonVariant: "filled" as const,
      popular: true,
    },
    {
      name: "Premium",
      price: "Custom",
      period: "",
      description: "For enterprise needs",
      features: [
        "Custom integrations",
        "Dedicated account manager",
        "Advanced analytics",
        "Custom reporting",
        "Unlimited data history",
        "24/7 phone support",
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" className={classes.inner}>
        <div className={classes.header}>
          <Title order={2} className={classes.title} ta="center">
            Simple Plans for Every Pack Size.
          </Title>
        </div>

        <Grid mt="xl" gutter="xl" justify="center">
          {plans.map((plan, index) => (
            <GridCol key={index} span={{ base: 12, md: 4 }}>
              <Box
                className={`${classes.planCard} ${plan.popular ? classes.popularCard : ""}`}
              >
                {plan.popular && (
                  <Badge className={classes.popularBadge} color="primary.5">
                    MOST POPULAR
                  </Badge>
                )}

                <div className={classes.planHeader}>
                  <Text className={classes.planName} fw={600}>
                    {plan.name}
                  </Text>
                  <div className={classes.priceWrapper}>
                    <Text className={classes.price}>{plan.price}</Text>
                    <Text className={classes.period}>{plan.period}</Text>
                  </div>
                  <Text className={classes.planDescription} size="sm">
                    {plan.description}
                  </Text>
                </div>

                <List className={classes.featureList} spacing="sm" mt="lg">
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} className={classes.feature}>
                      <div className={classes.featureContent}>
                        <IconCheck size={16} className={classes.checkIcon} />
                        <Text size="sm" className={classes.featureText}>
                          {feature}
                        </Text>
                      </div>
                    </ListItem>
                  ))}
                </List>

                <Button
                  className={classes.planButton}
                  variant={plan.buttonVariant}
                  color={plan.popular ? "primary.5" : "gray"}
                  size="md"
                  fullWidth
                  mt="xl"
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
