"use client";

import { useState } from "react";
import { 
  Container, 
  Title, 
  Text, 
  Stack,
  Button,
  Grid,
  GridCol,
  Box,
  List,
  ListItem,
  Badge,
  Switch,
  Group,
  Table,
  Accordion,
  Card
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import SimpleNavigationMenu from "./SimpleNavigationMenu";
import SimpleFooter from "./SimpleFooter";
import { AppShell, AppShellHeader, AppShellMain } from "@mantine/core";
import classes from "./PricingPage.module.css";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "For testers",
      features: [
        "1,000 tokens",
        "1 competitor slot", 
        "7-day history",
        "Basic spam filtering",
        "Email support (48h)"
      ],
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month", 
      description: "For growing brands",
      features: [
        "50,000 tokens",
        "5 competitor slots",
        "90-day history", 
        "Advanced spam filtering",
        "Team collaboration (up to 5 members)",
        "Priority support (24h)"
      ],
      buttonText: "Choose Pro",
      buttonVariant: "filled" as const,
      popular: true,
      trial: "Free 14-day trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For enterprise needs", 
      features: [
        "Unlimited tokens",
        "Unlimited competitors",
        "Full historical archive",
        "API access + custom integrations", 
        "SLA + Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { name: "Monthly tokens", starter: "1,000", pro: "50,000", enterprise: "Unlimited" },
    { name: "Competitor tracking", starter: "1", pro: "5", enterprise: "Unlimited" },
    { name: "Historical data", starter: "7 days", pro: "90 days", enterprise: "Unlimited" },
    { name: "Team members", starter: "1", pro: "5", enterprise: "Unlimited" },
    { name: "API access", starter: false, pro: true, enterprise: true },
    { name: "Custom integrations", starter: false, pro: false, enterprise: true }
  ];

  const faqData = [
    {
      value: "tokens",
      title: "What are tokens and how are they used?",
      content: "Tokens represent the number of mentions or comments analyzed by our AI."
    },
    {
      value: "upgrade",
      title: "Can I upgrade or downgrade my plan anytime?", 
      content: "Yes, upgrades take effect immediately. Downgrades apply at the next billing cycle."
    },
    {
      value: "trial",
      title: "Is there a free trial for paid plans?",
      content: "Yes! The Pro plan includes a 14-day free trial."
    }
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <AppShell header={{ height: 70 }}>
        <AppShellHeader>
          <SimpleNavigationMenu />
        </AppShellHeader>
        <AppShellMain style={{ padding: 0 }}>
          {/* Hero Section */}
          <section className={classes.heroSection}>
            <Container size="xl" className={classes.heroContainer}>
              <div className={classes.heroContent}>
                <Title order={1} className={classes.heroTitle} ta="center">
                  Choose the plan that fits your needs
                </Title>
                <Text className={classes.heroSubtitle} ta="center" mt="md">
                  From startups to enterprise teams, we have a plan that scales with your sentiment analysis needs. Start free and upgrade as you grow.
                </Text>
                
                <Group justify="center" mt="xl">
                  <Text size="sm" c="white">Monthly</Text>
                  <Switch 
                    size="lg" 
                    checked={isAnnual}
                    onChange={(event) => setIsAnnual(event.currentTarget.checked)}
                  />
                  <Group gap="xs">
                    <Text size="sm" c="white">Annual</Text>
                    <Badge color="primary.5" size="sm">Save 20%</Badge>
                  </Group>
                </Group>
              </div>
            </Container>
          </section>

          {/* Pricing Cards */}
          <section className={classes.pricingSection}>
            <Container size="xl">
              <Grid mt="xl" gutter="xl" justify="center">
                {plans.map((plan, index) => (
                  <GridCol key={index} span={{ base: 12, md: 4 }}>
                    <Box className={`${classes.planCard} ${plan.popular ? classes.popularCard : ""}`}>
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
                          <Text className={classes.period} c="gray.4">
                            {plan.period}
                          </Text>
                        </div>
                        {plan.trial && (
                          <Text className={classes.trialText} c="primary.4" size="sm" fw={500}>
                            {plan.trial}
                          </Text>
                        )}
                        <Text className={classes.planDescription} c="gray.4" size="sm">
                          {plan.description}
                        </Text>
                      </div>

                      <List className={classes.featureList} spacing="sm" mt="lg">
                        {plan.features.map((feature, featureIndex) => (
                          <ListItem key={featureIndex} className={classes.feature}>
                            <div className={classes.featureContent}>
                              <IconCheck size={16} className={classes.checkIcon} />
                              <Text size="sm" c="white">
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
                        c={plan.popular ? "white" : "white"}
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
          </section>

          {/* Feature Comparison Table */}
          <section className={classes.comparisonSection}>
            <Container size="xl">
              <Title order={2} className={classes.sectionTitle} ta="center" mb="xl">
                Feature Comparison
              </Title>
              
              <Card className={classes.comparisonTable}>
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Feature</Table.Th>
                      <Table.Th ta="center">Starter</Table.Th>
                      <Table.Th ta="center">Pro</Table.Th>
                      <Table.Th ta="center">Enterprise</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {comparisonFeatures.map((feature, index) => (
                      <Table.Tr key={index}>
                        <Table.Td fw={500}>{feature.name}</Table.Td>
                        <Table.Td ta="center">
                          {typeof feature.starter === 'boolean' ? (
                            feature.starter ? <IconCheck size={16} color="var(--mantine-color-success-5)" /> : <IconX size={16} color="var(--mantine-color-error-5)" />
                          ) : (
                            feature.starter
                          )}
                        </Table.Td>
                        <Table.Td ta="center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? <IconCheck size={16} color="var(--mantine-color-success-5)" /> : <IconX size={16} color="var(--mantine-color-error-5)" />
                          ) : (
                            feature.pro
                          )}
                        </Table.Td>
                        <Table.Td ta="center">
                          {typeof feature.enterprise === 'boolean' ? (
                            feature.enterprise ? <IconCheck size={16} color="var(--mantine-color-success-5)" /> : <IconX size={16} color="var(--mantine-color-error-5)" />
                          ) : (
                            feature.enterprise
                          )}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </Card>
            </Container>
          </section>

          {/* FAQ Section */}
          <section className={classes.faqSection}>
            <Container size="xl">
              <Title order={2} className={classes.sectionTitle} ta="center" mb="xl">
                Frequently Asked Questions
              </Title>
              
              <Box className={classes.faqContainer}>
                <Accordion variant="contained" radius="md">
                  {faqData.map((item) => (
                    <Accordion.Item key={item.value} value={item.value}>
                      <Accordion.Control>
                        <Text fw={500}>{item.title}</Text>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Text c="gray.6">{item.content}</Text>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Box>
            </Container>
          </section>

          <SimpleFooter />
        </AppShellMain>
      </AppShell>
    </div>
  );
};

export default PricingPage;