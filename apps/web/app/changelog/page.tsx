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
    version: "v2.1.0",
    date: "2025-01-15",
    title: "Enhanced Sentiment Analysis & Mobile Experience",
    description:
      "Major improvements to our AI sentiment detection and a completely redesigned mobile interface.",
    changes: [
      {
        type: "added",
        items: [
          "New advanced sentiment scoring algorithm with 95% accuracy",
          "Real-time sentiment trend graphs and analytics",
          "Mobile-first responsive design across all pages",
          "Dark mode support with automatic theme detection",
        ],
      },
      {
        type: "improved",
        items: [
          "Faster comment processing (3x speed improvement)",
          "Enhanced spam filtering with machine learning",
          "Better keyword matching with fuzzy search",
        ],
      },
      {
        type: "fixed",
        items: [
          "YouTube integration connection timeout issues",
          "Dashboard loading performance on large datasets",
          "Notification settings not saving properly",
        ],
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "2024-12-20",
    title: "Major Platform Overhaul",
    description:
      "Complete redesign with new features, improved performance, and expanded platform support.",
    changes: [
      {
        type: "added",
        items: [
          "Reddit integration for comprehensive social monitoring",
          "Advanced keyword tracking with sentiment alerts",
          "Custom dashboard with drag-and-drop widgets",
          "Team collaboration features and shared workspaces",
        ],
      },
      {
        type: "changed",
        items: [
          "Completely redesigned user interface",
          "New pricing tiers with more flexible options",
          "Improved onboarding flow for new users",
        ],
      },
      {
        type: "improved",
        items: [
          "API response times reduced by 60%",
          "Enhanced data visualization with interactive charts",
          "Better error handling and user feedback",
        ],
      },
    ],
  },
  {
    version: "v1.5.2",
    date: "2024-11-10",
    title: "Bug Fixes & Performance Improvements",
    description:
      "Critical bug fixes and under-the-hood improvements for better stability.",
    changes: [
      {
        type: "fixed",
        items: [
          "Memory leak in real-time data processing",
          "Incorrect sentiment scores for certain emoji combinations",
          "Dashboard freezing when handling large comment volumes",
        ],
      },
      {
        type: "improved",
        items: [
          "Reduced memory usage by 40%",
          "Faster initial page load times",
          "More accurate language detection",
        ],
      },
    ],
  },
  {
    version: "v1.5.0",
    date: "2024-10-25",
    title: "YouTube Integration Launch",
    description:
      "Our first major platform integration brings comprehensive YouTube comment analysis.",
    changes: [
      {
        type: "added",
        items: [
          "Full YouTube channel and video comment monitoring",
          "Historical data import for existing content",
          "Automated sentiment alerts via email and in-app notifications",
          "Export functionality for reports and data analysis",
        ],
      },
      {
        type: "improved",
        items: [
          "Enhanced sentiment accuracy with context-aware analysis",
          "Better handling of multiple languages",
          "Improved user dashboard with real-time updates",
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
        {/* Hero Section */}
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
        </section>

        {/* Sectional Divider */}
        <hr className={classes.sectionDivider} />

        {/* Changelog Entries */}
        <section className={classes.section}>
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
