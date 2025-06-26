"use client";
import { Box, Badge, Text, List, ListItem, Button } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { CardTitle, BodyText, DimmedText } from "@/components/atoms/Typography";
import classes from "./PricingCard.module.css";

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    buttonText: string;
    buttonVariant: "outline" | "filled";
    popular: boolean;
    trial?: string;
  };
}

const PricingCard = ({ plan }: PricingCardProps) => (
  <Box className={`${classes.planCard} ${plan.popular ? classes.popularCard : ""}`}>
    {plan.popular && (
      <Badge className={classes.popularBadge} color="primary.5">
        MOST POPULAR
      </Badge>
    )}

    <div className={classes.planHeader}>
      <CardTitle>{plan.name}</CardTitle>
      <div className={classes.priceWrapper}>
        <Text className={classes.price}>{plan.price}</Text>
        <DimmedText>{plan.period}</DimmedText>
      </div>
      {plan.trial && (
        <Text className={classes.trialText} c="primary.4" size="sm" fw={500}>
          {plan.trial}
        </Text>
      )}
      <DimmedText>{plan.description}</DimmedText>
    </div>

    <List className={classes.featureList} spacing="sm" mt="lg">
      {plan.features.map((feature, featureIndex) => (
        <ListItem key={featureIndex} className={classes.feature}>
          <div className={classes.featureContent}>
            <IconCheck size={16} className={classes.checkIcon} />
            <BodyText>{feature}</BodyText>
          </div>
        </ListItem>
      ))}
    </List>

    <Button
      className={classes.planButton}
      variant={plan.buttonVariant}
      color={plan.popular ? "primary.5" : "gray"}
      c={plan.popular ? "white" : "white"}
      size="md"
      fullWidth
      mt="xl"
    >
      {plan.buttonText}
    </Button>
  </Box>
);

export default PricingCard;
