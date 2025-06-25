"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Switch,
  Group,
  Stack,
  Card,
  Badge,
  Button,
  Grid,
  GridCol,
  List,
  ListItem,
  Table,
  TableTbody,
  TableTr,
  TableTh,
  TableTd,
  Accordion,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import classes from "./PricingPage.module.css";

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "1,000 tokens",
      features: [
        "1 competitor slot",
        "7-day history",
        "Basic spam filtering",
        "Email support (48h)",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "Free 14-day trial",
      features: [
        "50,000 tokens",
        "5 competitor slots",
        "90-day history",
        "Advanced spam filtering",
        "Team collaboration (up to 5 members)",
        "Priority support (24h)",
      ],
      cta: "Choose Pro",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Contact Sales",
      features: [
        "Unlimited tokens",
        "Unlimited competitors",
        "Full historical archive",
        "API access + custom integrations",
        "SLA + Dedicated account manager",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <Container size="lg" className={classes.wrapper}>
      <Title order={1} className={classes.heroTitle}>
        Choose the plan that fits your needs
      </Title>
      <Text className={classes.heroSubtitle}>
        From startups to enterprise teams, we have a plan that scales with your
        sentiment analysis needs. Start free and upgrade as you grow.
      </Text>
      <Group className={classes.toggleGroup}>
        <Text c="text-secondary.6">Monthly</Text>
        <Switch
          checked={annual}
          onChange={(e) => setAnnual(e.currentTarget.checked)}
          color="primary"
          size="lg"
        />
        <Group gap="xs" align="center">
          <Text c="text-secondary.6">Annual</Text>
          {annual && <Badge color="primary">Save 20%</Badge>}
        </Group>
      </Group>

      <Grid gutter="xl" justify="center">
        {plans.map((plan) => (
          <GridCol key={plan.name} span={{ base: 12, md: 4 }}>
            <Card p="lg" radius="md" withBorder className={`${classes.card} ${
              plan.popular ? classes.popular : ""
            }`}>
              {plan.popular && (
                <Badge color="primary" mb="sm">
                  Most Popular
                </Badge>
              )}
              <Stack>
                <Title order={3}>{plan.name}</Title>
                <Text fw={700} fz="xl">
                  {plan.price}
                  <Text span c="text-secondary.6" fz="sm">
                    /month
                  </Text>
                </Text>
                <Text c="text-secondary.6">{plan.description}</Text>
                <List spacing="xs" mt="sm">
                  {plan.features.map((feat) => (
                    <ListItem key={feat} icon={<IconCheck size={16} />}> {feat} </ListItem>
                  ))}
                </List>
                <Button color="primary" variant={plan.popular ? "filled" : "outline"} fullWidth>
                  {plan.cta}
                </Button>
              </Stack>
            </Card>
          </GridCol>
        ))}
      </Grid>

      <div className={classes.tableWrapper}>
        <Table mt="xl" withColumnBorders withRowBorders>
          <TableTbody>
            <TableTr>
              <TableTh>Feature</TableTh>
              <TableTh>Starter</TableTh>
              <TableTh>Pro</TableTh>
              <TableTh>Enterprise</TableTh>
            </TableTr>
            <TableTr>
              <TableTd>Monthly tokens</TableTd>
              <TableTd>1,000</TableTd>
              <TableTd>50,000</TableTd>
              <TableTd>Unlimited</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>Competitor tracking</TableTd>
              <TableTd>1</TableTd>
              <TableTd>5</TableTd>
              <TableTd>Unlimited</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>Historical data</TableTd>
              <TableTd>7 days</TableTd>
              <TableTd>90 days</TableTd>
              <TableTd>Unlimited</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>Team members</TableTd>
              <TableTd>1</TableTd>
              <TableTd>5</TableTd>
              <TableTd>Unlimited</TableTd>
            </TableTr>
            <TableTr>
              <TableTd>API access</TableTd>
              <TableTd>
                <IconX aria-label="No" />
              </TableTd>
              <TableTd>
                <IconCheck aria-label="Yes" />
              </TableTd>
              <TableTd>
                <IconCheck aria-label="Yes" />
              </TableTd>
            </TableTr>
            <TableTr>
              <TableTd>Custom integrations</TableTd>
              <TableTd>
                <IconX aria-label="No" />
              </TableTd>
              <TableTd>
                <IconX aria-label="No" />
              </TableTd>
              <TableTd>
                <IconCheck aria-label="Yes" />
              </TableTd>
            </TableTr>
          </TableTbody>
        </Table>
      </div>

      <div className={classes.faqWrapper}>
        <Accordion variant="separated" maw={600} mx="auto">
          <Accordion.Item value="tokens">
            <Accordion.Control>
              What are tokens and how are they used?
            </Accordion.Control>
            <Accordion.Panel>
              Tokens represent the number of mentions or comments analyzed by our
              AI.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="upgrade">
            <Accordion.Control>
              Can I upgrade or downgrade my plan anytime?
            </Accordion.Control>
            <Accordion.Panel>
              Yes, upgrades take effect immediately. Downgrades apply at the next
              billing cycle.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="trial">
            <Accordion.Control>
              Is there a free trial for paid plans?
            </Accordion.Control>
            <Accordion.Panel>
              Yes! The Pro plan includes a 14-day free trial.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </Container>
  );
}
