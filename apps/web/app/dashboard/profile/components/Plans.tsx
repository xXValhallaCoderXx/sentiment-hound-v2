/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SimpleGrid,
  Card,
  CardSection,
  Text,
  Group,
  Badge,
  Box,
  List,
  ListItem,
  ThemeIcon,
  Stack,
  Divider,
  Button,
} from "@mantine/core";
import { FC } from "react";
import {
  planService,
  PlanName,
  PLAN_FEATURES,
  PLAN_HIERARCHY,
} from "@repo/services";
import { Plan } from "@repo/db";
import PlanSubmitButton from "./PlanSubmitButton";
import { IconCheck, IconX } from "@tabler/icons-react";

interface IPlansProps {
  userPlanId: string;
}

const Plans: FC<IPlansProps> = async ({ userPlanId }) => {
  const allPlans = await planService.getPlans();

  // Filter to only show Trial, Starter, and Pro plans (exclude Developer)
  const publicPlans =
    allPlans?.filter((plan: Plan) =>
      [PlanName.TRIAL, PlanName.STARTER, PlanName.PRO].includes(
        plan.name as PlanName,
      ),
    ) || [];

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return "Free";
    return `$${(price / 100).toFixed(2)}`;
  };

  const formatYearlyDiscount = (monthly?: number, yearly?: number) => {
    if (!monthly || !yearly || yearly === 0) return null;
    const monthlyCost = (monthly * 12) / 100;
    const yearlyCost = yearly / 100;
    const savings = monthlyCost - yearlyCost;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return percentage > 0 ? `Save ${percentage}% yearly` : null;
  };

  // Get user's current plan for hierarchy comparison
  const userPlan = allPlans?.find(
    (plan: Plan) => Number(userPlanId) === plan.id,
  );
  const userPlanName = userPlan?.name as PlanName;
  const userPlanHierarchy =
    PLAN_HIERARCHY[userPlanName as keyof typeof PLAN_HIERARCHY] ?? -1;

  const renderFeatureMatrix = (planName: PlanName) => {
    const features = PLAN_FEATURES[planName as keyof typeof PLAN_FEATURES];
    if (!features) return null;

    const featureItems = [
      {
        label: "Monthly Token Allowance",
        value:
          features.monthlyTokenAllowance === 0
            ? "0"
            : features.monthlyTokenAllowance.toLocaleString(),
        enabled: features.monthlyTokenAllowance > 0,
      },
      {
        label: "Data Integrations",
        value: features.dataIntegrations.toString(),
        enabled: features.dataIntegrations > 0,
      },
      {
        label: "Competitor Tracking",
        value:
          features.competitorTracking === false
            ? "0"
            : features.competitorTracking.toString(),
        enabled: features.competitorTracking !== false,
      },
      {
        label: "Spam & Bot Filtering",
        value: features.spamBotFiltering ? "✅" : "❌",
        enabled: features.spamBotFiltering,
      },
      {
        label: "Actionable Insights",
        value: features.actionableInsights ? "✅" : "❌",
        enabled: features.actionableInsights,
      },
      {
        label: "Data Export",
        value: features.dataExport ? "✅" : "❌",
        enabled: features.dataExport,
      },
      {
        label: "Email/Chat Support",
        value: features.emailChatSupport ? "✅" : "❌",
        enabled: features.emailChatSupport,
      },
    ];

    return (
      <List spacing="xs" size="sm">
        {featureItems.map((item, index) => (
          <ListItem
            key={index}
            icon={
              <ThemeIcon
                color={item.enabled ? "teal" : "gray"}
                size={20}
                radius="xl"
              >
                {item.enabled ? <IconCheck size={14} /> : <IconX size={14} />}
              </ThemeIcon>
            }
          >
            <Group justify="space-between">
              <Text size="sm" c={item.enabled ? "dark" : "dimmed"}>
                {item.label}
              </Text>
              <Text size="sm" fw={500} c={item.enabled ? "dark" : "dimmed"}>
                {item.value}
              </Text>
            </Group>
          </ListItem>
        ))}
      </List>
    );
  };

  const getPlanButtonLogic = (plan: any) => {
    const isUsersPlan = Number(userPlanId) === plan.id;
    const planHierarchy =
      PLAN_HIERARCHY[plan.name as keyof typeof PLAN_HIERARCHY];

    if (isUsersPlan) {
      return {
        text: "Current Plan",
        disabled: true,
        color: "green",
        variant: "filled" as const,
      };
    }

    if (planHierarchy > userPlanHierarchy) {
      return {
        text: "Upgrade",
        disabled: false,
        color: "blue",
        variant: "filled" as const,
      };
    }

    // For plans lower than current plan, hide the button
    return null;
  };

  return (
    <Box>
      <SimpleGrid cols={3} spacing="lg" className="mt-4">
        {publicPlans.map((plan: Plan, index: number) => {
          const isUsersPlan = Number(userPlanId) === plan.id;
          const yearlyDiscount = formatYearlyDiscount(
            plan.price ? Number(plan.price) : undefined,
            plan.yearlyPrice ? Number(plan.yearlyPrice) : undefined,
          );
          const buttonLogic = getPlanButtonLogic(plan);

          return (
            <Card
              key={index}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{
                height: "100%",
                border: isUsersPlan
                  ? "2px solid var(--mantine-color-green-6)"
                  : undefined,
              }}
            >
              <CardSection>
                <Box
                  style={{
                    background: `linear-gradient(45deg, var(--mantine-color-blue-6), var(--mantine-color-indigo-6))`,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Text size="xl" fw={700} c="white" tt="capitalize">
                    {plan.name}
                  </Text>
                  {isUsersPlan && (
                    <Badge
                      color="green"
                      variant="filled"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                      }}
                    >
                      Your Plan
                    </Badge>
                  )}
                </Box>
              </CardSection>

              <Stack gap="md" mt="md">
                <Group justify="space-between" align="flex-start">
                  <Box>
                    <Text size="lg" fw={600}>
                      {formatPrice(plan.price ? Number(plan.price) : undefined)}
                      {plan.price && Number(plan.price) > 0 && (
                        <Text component="span" size="sm" c="dimmed">
                          /month
                        </Text>
                      )}
                    </Text>
                    {yearlyDiscount && (
                      <Text size="xs" c="green" fw={500}>
                        {yearlyDiscount}
                      </Text>
                    )}
                  </Box>
                </Group>

                <Text size="sm" c="dimmed">
                  {plan.description}
                </Text>

                <Divider />

                {renderFeatureMatrix(plan.name as PlanName)}

                {buttonLogic && buttonLogic.disabled ? (
                  <Button
                    color={buttonLogic.color}
                    variant={buttonLogic.variant}
                    fullWidth
                    disabled
                    mt="md"
                    radius="md"
                  >
                    {buttonLogic.text}
                  </Button>
                ) : buttonLogic ? (
                  <PlanSubmitButton
                    planId={String(plan.id)}
                    isUsersPlan={isUsersPlan}
                  />
                ) : null}
              </Stack>
            </Card>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Plans;
