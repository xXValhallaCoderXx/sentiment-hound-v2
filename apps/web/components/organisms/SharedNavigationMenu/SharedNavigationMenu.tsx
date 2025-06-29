"use client";
import Image from "next/image";
import { Group, Anchor, Text, Burger, Drawer, Stack, Box } from "@mantine/core";
import { ThemeToggle } from "@/components/molecules/ThemeToggle";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useSmartNavigation } from "@/lib/navigation.utils";

interface SharedNavigationMenuProps {
  links: { href: string; label: string }[];
  ctaButton: React.ReactNode;
}

const SharedNavigationMenu = ({ links, ctaButton }: SharedNavigationMenuProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const pathname = usePathname();
  const { handleNavigation } = useSmartNavigation();

  const isPricingPage = pathname === '/pricing';

  const filteredLinks = isPricingPage
    ? [{ href: '/', label: 'Home' }]
    : links;

  const handleLinkClick = (href: string, label: string) => {
    close(); // Close mobile menu
    handleNavigation(href, label);
  };

  const navigationLinks = filteredLinks.map(link => (
      <Anchor 
        c="dimmed" 
        fw={500} 
        onClick={() => handleLinkClick(link.href, link.label)} 
        key={link.href}
        style={{ cursor: 'pointer' }}
      >
        {link.label}
      </Anchor>
  ));

  return (
    <>
      <Group justify="space-between" px={24} h="100%">
        <Group gap="sm">
          <Image
            src="/images/logos/main-logo.png"
            alt=""
            height={50}
            width={50}
            className="mx-auto"
          />
          <Text c="dimmed">
            <Text span fw={700} c="primary.5" component="span">
              Sentiment
            </Text>{" "}
            Hound
          </Text>
        </Group>

        {/* Desktop Navigation */}
        <Group gap="lg" visibleFrom="md">
          <ThemeToggle />
          {ctaButton}
          {navigationLinks}
        </Group>

        {/* Mobile Navigation */}
        <Group gap="sm" hiddenFrom="md">
          <ThemeToggle />
          <Burger
            opened={opened}
            onClick={open}
            aria-label="Toggle navigation"
          />
        </Group>
      </Group>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title={
          <Text fw={700} c="dimmed">
            <Text span fw={700} c="primary.5" component="span">
              Sentiment
            </Text>{" "}
            Hound
          </Text>
        }
        padding="md"
        size="xs"
        position="right"
      >
        <Stack gap="lg">
          <Box>
            {ctaButton}
          </Box>
          <Stack gap="md">{navigationLinks}</Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default SharedNavigationMenu;
