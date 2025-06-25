"use client";

import {
  Accordion,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  List,
  Paper,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react"; // Assuming tabler-icons-react is used with Mantine
import React, { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  );

  return (
    <Container py="xl">
      {/* Hero Section */}
      <Stack align="center" gap="lg" mb={60}>
        <Title order={1} ta="center" fz={{ base: "2rem", sm: "3rem" }}>
          Choose the plan that fits your needs
        </Title>
        <Text
          c="dimmed" // Using "dimmed" which often maps to a secondary text color
          ta="center"
          fz="lg"
          maw={600}
        >
          From startups to enterprise teams, we have a plan that scales with
          your sentiment analysis needs. Start free and upgrade as you grow.
        </Text>
        <Group justify="center" mt="md">
          <Text
            size="lg"
            fw={billingCycle === "monthly" ? 700 : 500}
            onClick={() => setBillingCycle("monthly")}
            style={{ cursor: "pointer" }}
          >
            Monthly
          </Text>
          <Switch
            size="lg"
            checked={billingCycle === "annually"}
            onChange={(event) =>
              setBillingCycle(event.currentTarget.checked ? "annually" : "monthly")
            }
            aria-label="Toggle billing cycle"
          />
          <Group gap="xs" align="center">
            <Text
              size="lg"
              fw={billingCycle === "annually" ? 700 : 500}
              onClick={() => setBillingCycle("annually")}
              style={{ cursor: "pointer" }}
            >
              Annually
            </Text>
            {billingCycle === "annually" && (
              <Badge color="primary" variant="filled" size="lg" style={{lineHeight:1.2}}> {/* Adjusted line height for better centering if needed */}
                Save 20%
              </Badge>
            )}
          </Group>
        </Group>
      </Stack>

      {/* Pricing Cards Section */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" mb={60}>
        {/* Starter Plan Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
          <Stack justify="space-between" h="100%">
            <div>
              <Title order={2} fz="xl" mb="md">
                Starter Plan
              </Title>
              <Text fz="2.5rem" fw={700} mb="xs">
                $0
                <Text span fz="sm" c="dimmed">
                  /month
                </Text>
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="primary" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
                mb="lg"
              >
                <List.Item>1,000 tokens</List.Item>
                <List.Item>1 competitor slot</List.Item>
                <List.Item>7-day history</List.Item>
                <List.Item>Basic spam filtering</List.Item>
                <List.Item>Email support (48h)</List.Item>
              </List>
            </div>
            <Button
              variant="outline"
              color="primary"
              fullWidth
              size="lg"
              type="button"
            >
              Get Started
            </Button>
          </Stack>
        </Card>

        {/* Pro Plan Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
          <Stack justify="space-between" h="100%">
            <div>
              <Group justify="space-between" mb="md">
                <Title order={2} fz="xl">
                  Pro Plan
                </Title>
                <Badge color="primary" variant="light">
                  Most Popular
                </Badge>
              </Group>
              <Text fz="2.5rem" fw={700} mb="xs">
                $29
                <Text span fz="sm" c="dimmed">
                  /month
                </Text>
              </Text>
              <Text fz="sm" c="primary" mb="md">
                Free 14-day trial
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="primary" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
                mb="lg"
              >
                <List.Item>50,000 tokens</List.Item>
                <List.Item>5 competitor slots</List.Item>
                <List.Item>90-day history</List.Item>
                <List.Item>Advanced spam filtering</List.Item>
                <List.Item>Team collaboration (up to 5 members)</List.Item>
                <List.Item>Priority support (24h)</List.Item>
              </List>
            </div>
            <Button
              variant="filled"
              color="primary"
              fullWidth
              size="lg"
              type="button"
            >
              Start Free Trial
            </Button>
          </Stack>
        </Card>

        {/* Enterprise Plan Card */}
        <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
          <Stack justify="space-between" h="100%">
            <div>
              <Title order={2} fz="xl" mb="md">
                Enterprise Plan
              </Title>
              <Text fz="2rem" fw={700} mb="xs">
                Custom
              </Text>
              <Text fz="sm" c="dimmed" mb="md">
                Tailored to your needs
              </Text>
              <List
                spacing="xs"
                size="sm"
                center
                icon={
                  <ThemeIcon color="primary" size={20} radius="xl">
                    <IconCheck size={14} />
                  </ThemeIcon>
                }
                mb="lg"
              >
                <List.Item>Unlimited tokens</List.Item>
                <List.Item>Unlimited competitors</List.Item>
                <List.Item>Full historical archive</List.Item>
                <List.Item>API access + custom integrations</List.Item>
                <List.Item>SLA + Dedicated account manager</List.Item>
              </List>
            </div>
            <Button
              variant="default"
              fullWidth
              size="lg"
              type="button"
            >
              Contact Sales
            </Button>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Feature Comparison Table Section */}
      <Container size="lg" mb={60}>
        <Title order={2} ta="center" mb="xl">
          Compare Features
        </Title>
        <Paper withBorder shadow="sm" radius="md">
          <Table
            verticalSpacing="lg"
            horizontalSpacing="xl"
            highlightOnHover
            captionSide="bottom"
            aria-label="Feature Comparison Table"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Feature</Table.Th>
                <Table.Th ta="center">Starter</Table.Th>
                <Table.Th ta="center">Pro</Table.Th>
                <Table.Th ta="center">Enterprise</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {[
                {
                  feature: "Monthly tokens",
                  starter: "1,000",
                  pro: "50,000",
                  enterprise: "Unlimited",
                },
                {
                  feature: "Competitor tracking",
                  starter: "1",
                  pro: "5",
                  enterprise: "Unlimited",
                },
                {
                  feature: "Historical data",
                  starter: "7 days",
                  pro: "90 days",
                  enterprise: "Unlimited",
                },
                {
                  feature: "Team members",
                  starter: "1",
                  pro: "5",
                  enterprise: "Unlimited",
                },
                {
                  feature: "API access",
                  starter: <IconX size={20} color="var(--mantine-color-red-6)" aria-label="Not supported" />,
                  pro: <IconCheck size={20} color="var(--mantine-color-green-6)" aria-label="Supported" />,
                  enterprise: <IconCheck size={20} color="var(--mantine-color-green-6)" aria-label="Supported" />,
                },
                {
                  feature: "Custom integrations",
                  starter: <IconX size={20} color="var(--mantine-color-red-6)" aria-label="Not supported" />,
                  pro: <IconX size={20} color="var(--mantine-color-red-6)" aria-label="Not supported" />,
                  enterprise: <IconCheck size={20} color="var(--mantine-color-green-6)" aria-label="Supported" />,
                },
              ].map((item) => (
                <Table.Tr key={item.feature}>
                  <Table.Td>{item.feature}</Table.Td>
                  <Table.Td ta="center">{item.starter}</Table.Td>
                  <Table.Td ta="center">{item.pro}</Table.Td>
                  <Table.Td ta="center">{item.enterprise}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Container>

      {/* FAQ Section */}
      <Container size="md" py="xl">
        <Title order={2} ta="center" mb="xl">
          Frequently Asked Questions
        </Title>
        <Accordion variant="separated" radius="md">
          <Accordion.Item value="tokens">
            <Accordion.Control>
              What are tokens and how are they used?
            </Accordion.Control>
            <Accordion.Panel>
              Tokens represent the number of mentions or comments analyzed by
              our AI.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="upgrade-downgrade">
            <Accordion.Control>
              Can I upgrade or downgrade my plan anytime?
            </Accordion.Control>
            <Accordion.Panel>
              Yes, upgrades take effect immediately. Downgrades apply at the
              next billing cycle.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="free-trial">
            <Accordion.Control>
              Is there a free trial for paid plans?
            </Accordion.Control>
            <Accordion.Panel>
              Yes! The Pro plan includes a 14-day free trial.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Container>
    </Container>
  );
}
