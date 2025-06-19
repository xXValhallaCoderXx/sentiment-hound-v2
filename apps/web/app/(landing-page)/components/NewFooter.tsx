import { Box, Text, Container, Group, Anchor, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';

export const NewFooter = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const linkColor = colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[2];
  // Defining a slightly different hover color for links to make the hover effect more noticeable
  const linkHoverColor = colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.dark[2];

  return (
    <Box
      component="footer"
      py="xl"
      bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[9]}
      c={colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[2]}
    >
      <Container size="lg">
        <Group justify="space-between" align="center"> {/* Changed position to justify */}
          <Text size="sm">&copy; {new Date().getFullYear()} Your Company. All rights reserved.</Text>
          <Group spacing="md"> {/* Increased spacing for better touch targets */}
            <Anchor
              component={Link}
              href="/privacy"
              passHref
              legacyBehavior
              c={linkColor}
              styles={{ root: { '&:hover': { textDecoration: 'underline', color: linkHoverColor } } }}
              size="sm"
            >
              Privacy
            </Anchor>
            <Anchor
              component={Link}
              href="/terms"
              passHref
              legacyBehavior
              c={linkColor}
              styles={{ root: { '&:hover': { textDecoration: 'underline', color: linkHoverColor } } }}
              size="sm"
            >
              Terms
            </Anchor>
            <Anchor
              component={Link}
              href="/contact"
              passHref
              legacyBehavior
              c={linkColor}
              styles={{ root: { '&:hover': { textDecoration: 'underline', color: linkHoverColor } } }}
              size="sm"
            >
              Contact
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};
