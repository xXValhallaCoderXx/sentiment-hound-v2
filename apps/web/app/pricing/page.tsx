"use client";

import { useState } from "react";
import { 
  Container, 
  Grid,
  GridCol,
  Box,
  Switch,
  Group,
  Table,
  Accordion,
  Card,
  Badge
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Footer } from "@/app/(landing-page)/components/Footer";
import { PageTitle, SectionTitle, BodyText, DimmedText } from "@/components/atoms/Typography";
import { PricingCard } from "@/components/molecules/PricingCard";
import sectionClasses from "../(landing-page)/SectionBackgrounds.module.css";
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
    <>
      <section className={`${sectionClasses.sectionPrimary} ${sectionClasses.wrapper}`}>
        <Container size="xl" className={classes.heroContainer}>
          <div className={classes.heroContent}>
            <PageTitle ta="center">
              Choose the plan that fits your needs
            </PageTitle>
            <BodyText ta="center" mt="md">
              From startups to enterprise teams, we have a plan that scales with your sentiment analysis needs. Start free and upgrade as you grow.
            </BodyText>
            
            <Group justify="center" mt="xl">
              <BodyText>Monthly</BodyText>
              <Switch 
                size="lg" 
                checked={isAnnual}
                onChange={(event) => setIsAnnual(event.currentTarget.checked)}
              />
              <Group gap="xs">
                <BodyText>Annual</BodyText>
                <Badge color="primary.5" size="sm">Save 20%</Badge>
              </Group>
            </Group>
          </div>
        </Container>
      </section>

      {/* Pricing Cards */}
      <section className={`${sectionClasses.sectionAlt} ${sectionClasses.wrapper}`}>
        <Container size="xl">
          <Grid gutter="xl" justify="center">
            {plans.map((plan, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <PricingCard plan={plan} />
              </GridCol>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Feature Comparison Table */}
      <section className={`${sectionClasses.sectionPrimary} ${sectionClasses.wrapper}`}>
        <Container size="xl">
          <SectionTitle ta="center" mb="xl">
            Feature Comparison
          </SectionTitle>
          
          <Box style={{ overflowX: 'auto' }}>
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
                          feature.starter ? <IconCheck size={16} color="var(--mantine-color-green-5)" /> : <IconX size={16} color="var(--mantine-color-red-5)" />
                        ) : (
                          feature.starter
                        )}
                      </Table.Td>
                      <Table.Td ta="center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? <IconCheck size={16} color="var(--mantine-color-green-5)" /> : <IconX size={16} color="var(--mantine-color-red-5)" />
                        ) : (
                          feature.pro
                        )}
                      </Table.Td>
                      <Table.Td ta="center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? <IconCheck size={16} color="var(--mantine-color-green-5)" /> : <IconX size={16} color="var(--mantine-color-red-5)" />
                        ) : (
                          feature.enterprise
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Card>
          </Box>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className={`${sectionClasses.sectionAlt} ${sectionClasses.wrapper}`}>
        <Container size="xl">
          <SectionTitle ta="center" mb="xl">
            Frequently Asked Questions
          </SectionTitle>
          
          <Box className={classes.faqContainer}>
            <Accordion variant="contained" radius="md">
              {faqData.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.Control>
                    <BodyText fw={500}>{item.title}</BodyText>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <DimmedText>{item.content}</DimmedText>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Box>
        </Container>
      </section>

      <Footer />
    </>
  );
};

export default PricingPage;
