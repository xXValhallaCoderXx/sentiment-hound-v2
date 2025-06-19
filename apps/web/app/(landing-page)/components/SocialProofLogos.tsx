import { Box, Container, Title, SimpleGrid, useMantineTheme, useMantineColorScheme, Paper, Text } from '@mantine/core';

export const SocialProofLogos = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const sectionBgColor = colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0];
  // Using a slightly more subtle placeholder background for logos, or could be transparent if real logos have backgrounds
  const logoPlaceholderBgColor = colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1];
  const logoPlaceholderBorderColor = colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];


  return (
    <Box component="section" id="social-proof-logos" py="xl" bg={sectionBgColor}>
      <Container size="lg">
        <Title order={2} ta="center" mb="lg">
          Trusted by Leading Companies Worldwide
        </Title>
        <SimpleGrid
          cols={{ base: 2, sm: 3, md: 5 }} // Responsive column count
          spacing="lg"
          verticalSpacing="lg"
        >
          {[...Array(5)].map((_, index) => (
            <Paper
              key={index}
              h={80} // Height for logo area
              bg={logoPlaceholderBgColor}
              // withBorder  // Border can be conditional or styled via 'style' prop
              radius="sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${logoPlaceholderBorderColor}` // Custom border color
              }}
            >
              <Text c={colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6]} fz="sm">
                {/* Placeholder text, actual logos would be <img> or <svg> */}
                Client Logo
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};
