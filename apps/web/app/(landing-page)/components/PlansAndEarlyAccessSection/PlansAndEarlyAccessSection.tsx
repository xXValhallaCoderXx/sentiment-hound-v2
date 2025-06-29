"use client";

import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  Group,
  Grid,
  GridCol,
  ThemeIcon,
  Paper,
  Badge as MantineBadge,
  Stack,
  Alert,
  List,
  ListItem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useActionState } from "react";
import {
  IconDiscount,
  IconRocket,
  IconFlask,
  IconArrowRight,
  IconCheck,
  IconInfoCircle,
  IconStar,
} from "@tabler/icons-react";
import { handleEarlyAccessSignup } from "@/actions/early-access.actions";
import { Badge } from "@/components/atoms/Badge";
import classes from "./PlansAndEarlyAccessSection.module.css";

interface FormValues {
  name?: string;
  email: string;
}

const PlansAndEarlyAccessSection = () => {
  const [state, formAction] = useActionState(handleEarlyAccessSignup, null);

  const form = useForm<FormValues>({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Please enter a valid email address",
      name: (value) =>
        value && value.length < 2 ? "Name must have at least 2 letters" : null,
    },
  });

  // Disable form if already successfully submitted or if email already exists
  const isDisabled = state?.success || state?.alreadyExists;

  const plans = [
    {
      name: "Starter",
      price: "~ $29",
      period: " / month",
      features: [
        "10,000 AI Tokens / month",
        "1 Tracked Brand",
        "1 Competitor Slot",
        "30-Day Data History",
        "Standard Spam Filtering",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "~ $99",
      period: " / month",
      features: [
        "100,000 AI Tokens / month",
        "3 Tracked Brands",
        "5 Competitor Slots",
        "Full Data History",
        "Advanced Spam Filtering & Bot Detection",
        "Team Collaboration (Up to 5 seats)",
        "Priority Email Support (24hr)",
      ],
      popular: true,
    },
  ];

  const benefits = [
    {
      icon: IconDiscount,
      title: "Exclusive lifetime discount",
      description: "Lock in special 'Good Dog' pricing before public launch",
      color: "red",
    },
    {
      icon: IconRocket,
      title: "Priority onboarding",
      description: "Priority onboarding when we unleash the alpha",
      color: "blue",
    },
    {
      icon: IconFlask,
      title: "Access to the latest features",
      description: "A direct line to influence new features",
      color: "green",
    },
  ];

  return (
    <div className={classes.wrapper}>
      <Container size="xl" py="xl">
        {/* Section Header */}
        <div className={classes.header}>
          <Title order={2} className={classes.title}>
            Choose the plan that fits your needs
          </Title>
          <Text className={classes.subtitle}>
            From startups to enterprise teams, we have a plan that scales with
            your sentiment analysis needs. Please note that plans and pricing for our public launch are not yet final.
          </Text>
        </div>

        {/* Value Anchor Sub-section (Pricing Cards) */}
        <div className={classes.valueAnchor}>
          <Grid gutter="xl" justify="center">
            {plans.map((plan, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6 }}>
                <Paper
                  className={`${classes.pricingCard} ${plan.popular ? classes.popularCard : ""}`}
                >
                  {plan.popular && (
                    <MantineBadge className={classes.popularBadge} color="primary.5">
                      Most Popular
                    </MantineBadge>
                  )}

                  <div className={classes.cardHeader}>
                    <Text className={classes.planName} fw={600} size="xl">
                      {plan.name}
                    </Text>
                    <div className={classes.priceSection}>
                      <Text className={classes.price}>
                        {plan.price}
                        <span className={classes.period}>{plan.period}</span>
                      </Text>
                      <Text
                        className={classes.estimatedPrice}
                        size="sm"
                        c="dimmed"
                      >
                        (Estimated Launch Price)
                      </Text>
                    </div>
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
                </Paper>
              </GridCol>
            ))}
          </Grid>
        </div>

        {/* Pricing Disclaimer */}
        <div className={classes.pricingDisclaimer}>
          <Text className={classes.disclaimerText}>
            Note: These are preliminary plans for our future launch. All prices are estimates and subject to change.
          </Text>
        </div>

        {/* Transition/Divider */}
        <div className={classes.transition}>
          <div className={classes.transitionDivider}>
            <hr className={classes.dividerLine} />
            <Title order={4} className={classes.transitionHeading}>
              Or, Become a Founding User
            </Title>
          </div>
        </div>

        {/* Golden Ticket CTA Sub-section */}
        <div id="early-access" className={classes.goldenTicket}>
          <div className={classes.ctaHeader}>
            <Badge
              variant="filled"
              colorScheme="primary"
              icon={<IconStar size={14} />}
            >
              EARLY PUP ACCESS
            </Badge>

            <Title order={3} className={classes.ctaTitle}>
              Be the first to know.
            </Title>

            <Text className={classes.ctaSubtitle}>
              Join our waitlist for the private alpha. All early adopters will
              receive the Developer Plan for free, which includes a generous
              one-time token allowance and all &lsquo;Pro&rsquo; plan features
              during the testing period.
            </Text>
          </div>

          <Grid gutter="xl" align="stretch" className={classes.ctaContent}>
            <GridCol span={{ base: 12, md: 7 }} order={{ base: 1, md: 1 }}>
              <div className={classes.benefitsGrid}>
                {benefits.map((benefit, index) => (
                  <Paper key={index} className={classes.benefitCard} p="md">
                    <Group gap="sm" align="flex-start">
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color={benefit.color}
                        className={classes.benefitIcon}
                      >
                        <benefit.icon size={20} />
                      </ThemeIcon>
                      <div>
                        <Text fw={600} className={classes.benefitTitle}>
                          {benefit.title}
                        </Text>
                        <Text
                          size="sm"
                          c="dimmed"
                          className={classes.benefitDescription}
                        >
                          {benefit.description}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </div>
            </GridCol>

            <GridCol span={{ base: 12, md: 5 }} order={{ base: 2, md: 2 }}>
              <Paper className={classes.formCard} p="xl">
                <form action={formAction}>
                  <Stack gap="md">
                    <TextInput
                      name="name"
                      placeholder="Enter your name (optional)"
                      {...form.getInputProps("name")}
                      className={classes.input}
                      disabled={isDisabled}
                    />

                    <TextInput
                      name="email"
                      placeholder="Enter your email address"
                      required
                      {...form.getInputProps("email")}
                      className={classes.input}
                      disabled={isDisabled}
                    />

                    <Button
                      type="submit"
                      size="lg"
                      rightSection={<IconArrowRight size={16} />}
                      disabled={isDisabled}
                      c="white"
                      variant={
                        state?.success || state?.alreadyExists
                          ? "success"
                          : "primary"
                      }
                    >
                      {state?.success
                        ? "You're In! 🎉"
                        : state?.alreadyExists
                          ? "Already Signed Up ✓"
                          : "Claim Your Spot →"}
                    </Button>

                    {state?.error && !state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="red"
                        icon={<IconInfoCircle size={16} />}
                      >
                        {state.error}
                      </Alert>
                    )}

                    {state?.error && state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="blue"
                        icon={<IconCheck size={16} />}
                      >
                        {state.error}
                      </Alert>
                    )}

                    {state?.success && !state?.alreadyExists && (
                      <Alert
                        variant="light"
                        color="green"
                        icon={<IconCheck size={16} />}
                      >
                        {state.message ||
                          "Success! You've been added to our early access list."}
                      </Alert>
                    )}

                    <Text
                      size="xs"
                      c="dimmed"
                      ta="center"
                      className={classes.disclaimer}
                    >
                      No spam. Just early access to insights that matter.
                    </Text>
                  </Stack>
                </form>
              </Paper>
            </GridCol>
          </Grid>
        </div>
      </Container>
    </div>
  );
};

export default PlansAndEarlyAccessSection;
