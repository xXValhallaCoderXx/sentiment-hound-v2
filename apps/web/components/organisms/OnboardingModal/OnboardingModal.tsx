"use client";

import {
  Modal,
  Stack,
  Title,
  Text,
  Button,
  Group,
  ThemeIcon,
  Card,
  Flex,
  Container,
  rem,
} from "@mantine/core";
import {
  IconBrandYoutube,
  IconBrandReddit,
  IconBrandFacebook,
  IconBrandInstagram,
  IconArrowRight,
  IconSparkles,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { OnboardingModalProps, OnboardingProvider } from "@/types/onboarding.types";
import classes from "./OnboardingModal.module.css";

const providers: OnboardingProvider[] = [
  {
    name: "YouTube",
    icon: IconBrandYoutube,
    color: "#FF0000",
    description: "Analyze comments from your YouTube videos and track audience sentiment",
  },
  {
    name: "Reddit",
    icon: IconBrandReddit,
    color: "#FF4500",
    description: "Track mentions and discussions across Reddit communities",
  },
  {
    name: "Facebook",
    icon: IconBrandFacebook,
    color: "#1877F2",
    description: "Monitor sentiment from Facebook posts and interactions",
  },
  {
    name: "Instagram",
    icon: IconBrandInstagram,
    color: "#E4405F",
    description: "Analyze engagement and sentiment on Instagram content",
  },
];

export function OnboardingModal({ opened, onClose }: OnboardingModalProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    onClose();
    router.push("/dashboard/integrations");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="lg"
      centered
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.6,
        blur: 8,
      }}
      classNames={{
        content: classes.modalContent,
      }}
    >
      <Container size="sm" p={0}>
        <Stack gap="xl" align="center">
          {/* Welcome Header */}
          <Stack gap="md" align="center">
            <ThemeIcon
              size={rem(80)}
              radius="xl"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              <IconSparkles size={rem(40)} />
            </ThemeIcon>
            <Title order={2} ta="center" className={classes.title}>
              Welcome to Sentiment Hound! 🎉
            </Title>
            <Text size="lg" ta="center" c="dimmed" maw={400}>
              Let&apos;s get you started with analyzing sentiment from your social media content.
              Connect your accounts to unlock powerful insights! 📊
            </Text>
          </Stack>

          {/* Next Steps */}
          <Card w="100%" p="lg" radius="md" className={classes.stepsCard}>
            <Stack gap="md">
              <Title order={4} c="blue">
                Your Next Steps:
              </Title>
              <Text size="sm" c="dimmed">
                Connect your social media accounts to start analyzing sentiment from your content and audience interactions.
              </Text>
              
              {/* Provider Grid */}
              <Stack gap="xs" mt="sm">
                {providers.map((provider) => (
                  <Flex
                    key={provider.name}
                    align="center"
                    gap="md"
                    p="sm"
                    className={classes.providerItem}
                  >
                    <ThemeIcon
                      size={32}
                      radius="md"
                      style={{ backgroundColor: provider.color }}
                    >
                      <provider.icon size={18} />
                    </ThemeIcon>
                    <Stack gap={2} style={{ flex: 1 }}>
                      <Text fw={500} size="sm">
                        {provider.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {provider.description}
                      </Text>
                    </Stack>
                  </Flex>
                ))}
              </Stack>
            </Stack>
          </Card>

          {/* Action Buttons */}
          <Group w="100%" mt="md">
            <Button
              variant="light"
              color="gray"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              I&apos;ll do this later
            </Button>
            <Button
              onClick={handleGetStarted}
              rightSection={<IconArrowRight size={16} />}
              style={{ flex: 1 }}
              gradient={{ from: "blue", to: "cyan" }}
              variant="gradient"
            >
              Get Started
            </Button>
          </Group>
        </Stack>
      </Container>
    </Modal>
  );
}