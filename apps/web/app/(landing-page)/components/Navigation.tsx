import { Box, Group, Button, Text } from '@mantine/core';
import Link from 'next/link';

export const Navigation = () => {
  return (
    <Box component="header" py="md" px="lg" sx={(theme) => ({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0], // Light gray for light, dark for dark
      borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    })}>
      <Group position="apart">
        <Link href="/" passHref>
          <Text component="a" weight={700} size="xl" sx={(theme) => ({
            color: theme.colorScheme === 'dark' ? theme.white : theme.black, // Ensure logo text is visible
            '&:hover': {
              textDecoration: 'none',
              color: theme.colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7],
            }
          })}>Logo</Text>
        </Link>
        <Button component={Link} href="/signup" passHref color="accent">
          {/* 'accent' should now be our newOrange */}
          Sign Up
        </Button>
      </Group>
    </Box>
  );
};
