import { FC, ReactNode } from "react";
import { Flex, Title, Text, Button, Stack } from "@mantine/core";
import { IconPlus, IconLink, IconMoodEmpty, TablerIcon } from "@tabler/icons-react";

interface EmptyStateProps {
  /** Icon to display */
  icon?: TablerIcon;
  /** Empty state title */
  title?: string;
  /** Empty state description message */
  message?: string;
  /** Text for the call-to-action button */
  ctaText?: string;
  /** Function to call when CTA button is clicked */
  onCtaClick?: () => void;
  /** Show call-to-action button */
  showCta?: boolean;
  /** Custom icon color */
  iconColor?: string;
  /** Additional content to render below the CTA */
  children?: ReactNode;
}

const EmptyState: FC<EmptyStateProps> = ({
  icon: IconComponent = IconMoodEmpty,
  title = "No data yet",
  message = "Get started by adding your first item.",
  ctaText = "Add New",
  onCtaClick,
  showCta = true,
  iconColor = "var(--mantine-color-blue-6)",
  children,
}) => {
  return (
    <Flex direction="column" align="center" justify="center" gap="md" py="xl">
      <IconComponent size={64} color={iconColor} opacity={0.6} />
      <Stack gap="xs" align="center">
        <Title order={3} ta="center">
          {title}
        </Title>
        <Text ta="center" c="dimmed" size="sm" maw={400}>
          {message}
        </Text>
      </Stack>
      {showCta && onCtaClick && (
        <Button
          onClick={onCtaClick}
          leftSection={<IconPlus size={16} />}
          mt="md"
        >
          {ctaText}
        </Button>
      )}
      {children}
    </Flex>
  );
};

// Predefined empty state variants for common scenarios
export const IntegrationsEmptyState: FC<Omit<EmptyStateProps, "icon" | "title" | "message" | "ctaText">> = (props) => (
  <EmptyState
    {...props}
    icon={IconLink}
    title="No integrations yet"
    message="Connect a source like YouTube or Reddit to start analyzing sentiment."
    ctaText="Add New Integration"
  />
);

export const CompetitorsEmptyState: FC<Omit<EmptyStateProps, "icon" | "title" | "message" | "ctaText">> = (props) => (
  <EmptyState
    {...props}
    icon={IconPlus}
    title="No competitors yet"
    message="Add competitors to track and analyze their sentiment across multiple platforms."
    ctaText="Add Competitor"
  />
);

export default EmptyState;