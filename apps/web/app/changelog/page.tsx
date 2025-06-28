"use client";

import {
  Container,
  Badge,
  Stack,
  Card,
  Group,
  Text,
  Divider,
} from "@mantine/core";
import { IconCalendar, IconPlus, IconBug, IconTool } from "@tabler/icons-react";
import PublicPageLayout from "@/components/templates/PublicPageLayout";
import {
  PageTitle,
  SectionTitle,
  BodyText,
  DimmedText,
} from "@/components/atoms/Typography";
import classes from "./ChangelogPage.module.css";

interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: {
    type: "added" | "fixed" | "improved" | "changed";
    items: string[];
  }[];
}

const changelogData: ChangelogEntry[] = [
  {
    version: "v0.0.1",
    date: "2025-06-29",
    title: "Website & Brand Identity Refinements",
    description:
      "A major push on refining the design system and user experience across our marketing pages to prepare for the private alpha.",
    changes: [
      {
        type: "added",
        items: [
          "Premium 'lift & glow' hover and 'press' click effects for all primary Call-to-Action buttons.",
          "Site-wide smooth scrolling for a better user experience on internal anchor links.",
        ],
      },
      {
        type: "improved",
        items: [
          "Unified the visual design of the Landing and Features pages with a new 'Living Canvas' background strategy, eliminating disjointed sections.",
          "Overhauled the landing page's 'Plans' section to a 'Value Anchoring' model to better communicate future value and focus on the private alpha invitation.",
          "Standardized all feature-grid components ('Core Features', 'Built for the Underdog') with a consistent design system and a unified icon set from Tabler Icons.",
          "Enhanced navigation by making all 'Early Access' CTAs functional, page-scrolling anchor links.",
        ],
      },
      {
        type: "fixed",
        items: [
          "Fixed a critical responsive layout bug causing the main headline on the Features page to be cut off on mobile viewports.",
          "Resolved inconsistent vertical alignment of the hero section content on mobile devices to improve the 'above the fold' experience.",
        ],
      },
    ],
  },
];

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case "added":
      return <IconPlus size={16} color="var(--mantine-color-green-6)" />;
    case "fixed":
      return <IconBug size={16} color="var(--mantine-color-red-6)" />;
    case "improved":
    case "changed":
      return <IconTool size={16} color="var(--mantine-color-blue-6)" />;
    default:
      return <IconTool size={16} color="var(--mantine-color-gray-6)" />;
  }
};

const getChangeTypeBadge = (type: string) => {
  const colors = {
    added: "green",
    fixed: "red",
    improved: "blue",
    changed: "orange",
  };

  return (
    <Badge
      size="sm"
      variant="light"
      color={colors[type as keyof typeof colors] || "gray"}
      leftSection={getChangeTypeIcon(type)}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
};

const ChangelogPage = () => {
  return (
    <PublicPageLayout>
      {/* Living Canvas Background - Fixed Layer */}
      <div className={classes.livingCanvasBackground}>
        <div className={classes.glow1}></div>
        <div className={classes.glow2}></div>
        <div className={classes.glow3}></div>
      </div>

      {/* Content Layer - Scrollable */}
      <main className={classes.contentLayer}>
        {/* Changelog Entries */}
        <section className={classes.section}>
          <Container size="xl" className={classes.heroContainer}>
            <div className={classes.heroContent}>
              <PageTitle ta="center">
                What&apos;s New in Sentiment Hound
              </PageTitle>
              <BodyText ta="center" mt="md">
                Stay up to date with new features, improvements, and bug fixes.
                We&apos;re constantly working to make Sentiment Hound better for
                you.
              </BodyText>
            </div>
          </Container>
          <Container size="md" py="xl">
            <Stack gap="xl">
              {changelogData.map((entry) => (
                <Card
                  key={entry.version}
                  className={classes.changelogCard}
                  padding="xl"
                  radius="lg"
                >
                  <Group justify="space-between" align="flex-start" mb="md">
                    <div>
                      <Group gap="sm" mb="xs">
                        <Badge size="lg" variant="filled" color="primary">
                          {entry.version}
                        </Badge>
                        <Group gap="xs" c="dimmed">
                          <IconCalendar size={16} />
                          <DimmedText size="sm">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </DimmedText>
                        </Group>
                      </Group>
                      <SectionTitle order={3} size="h3" mb="xs">
                        {entry.title}
                      </SectionTitle>
                      <BodyText c="dimmed" mb="lg">
                        {entry.description}
                      </BodyText>
                    </div>
                  </Group>

                  <Stack gap="lg">
                    {entry.changes.map((changeGroup, changeIndex) => (
                      <div key={changeIndex}>
                        <Group mb="sm">
                          {getChangeTypeBadge(changeGroup.type)}
                        </Group>
                        <Stack gap="xs" pl="md">
                          {changeGroup.items.map((item, itemIndex) => (
                            <Group key={itemIndex} gap="sm" align="flex-start">
                              <Text
                                size="lg"
                                c="dimmed"
                                style={{ lineHeight: 1 }}
                              >
                                •
                              </Text>
                              <BodyText size="sm" style={{ flex: 1 }}>
                                {item}
                              </BodyText>
                            </Group>
                          ))}
                        </Stack>
                        {changeIndex < entry.changes.length - 1 && (
                          <Divider my="md" variant="dashed" />
                        )}
                      </div>
                    ))}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Container>
        </section>
      </main>
    </PublicPageLayout>
  );
};

export default ChangelogPage;
