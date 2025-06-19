import { Box, Group, Button, Text, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import Link from 'next/link';

export const Navigation = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box
      component="header"
      py="md"
      px="lg"
      bg={colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}
      // Using style prop for borderBottom as direct 'bdb' or similar with theme colors is less straightforward for Box
      style={{ borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` }}
    >
      <Group justify="apart"> {/* justify is the v7 prop for position */}
        <Link href="/" passHref legacyBehavior>
          {/* legacyBehavior for Next.js Link with Mantine component as child */}
          <Text
            component="a"
            fw={700} // fontWeight
            fz="xl" // fontSize
            c={colorScheme === 'dark' ? theme.white : theme.black} // color
            style={{ textDecoration: 'none' }} // remove underline from link
            styles={{
              root: {
                '&:hover': {
                  color: colorScheme === 'dark' ? theme.colors.gray[4] : theme.colors.gray[7],
                  textDecoration: 'none', // Ensure no underline on hover either
                }
              }
            }}
          >
            Logo
          </Text>
        </Link>
        <Button component={Link} href="/signup" passHref color="accent" radius="md" size="md">
          {/* 'accent' correctly uses newOrange from our theme */}
          Sign Up
        </Button>
      </Group>
    </Box>
  );
};
