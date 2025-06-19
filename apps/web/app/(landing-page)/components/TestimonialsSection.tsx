import { Box, Container, Title, Text, Grid, GridCol, Card, Avatar, Group, Blockquote, useMantineTheme, useMantineColorScheme } from '@mantine/core';

const testimonialData = [
  {
    quote: "This product has revolutionized how we manage our data. The efficiency gains are incredible, and the support team is top-notch!",
    name: "Jane Doe",
    title: "CEO, Tech Solutions Inc.",
    avatarSrc: null, // Placeholder, can use Mantine's default Avatar if src is empty or null
  },
  {
    quote: "I was skeptical at first, but after a week of using this platform, I can't imagine going back. It's intuitive, powerful, and beautiful.",
    name: "John Smith",
    title: "Marketing Director, Creative Co.",
    avatarSrc: null,
  },
  {
    quote: "The collaborative features are a game-changer for our remote team. We're more aligned and productive than ever before.",
    name: "Alice Brown",
    title: "Operations Manager, Global Logistics",
    avatarSrc: null,
  },
];

export const TestimonialsSection = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Assuming SocialProofLogos was gray[0] (light mode), this section will be white in light mode.
  const sectionBgColor = colorScheme === 'dark' ? theme.colors.dark[6] : theme.white;
  const cardBgColor = colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]; // Card slightly different from section bg
  const quoteColor = colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <Box component="section" id="testimonials" py="xl" bg={sectionBgColor}>
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl">
          Don't Just Take Our Word For It
        </Title>
        <Grid gutter="xl" align="stretch"> {/* Ensure columns stretch to equal height */}
          {testimonialData.map((testimonial, index) => (
            <GridCol span={{ base: 12, md: 4 }} key={index}>
              <Card shadow="md" radius="md" p="xl" bg={cardBgColor} h="100%">
                <Stack justify="space-between" h="100%"> {/* Stack to push author to bottom */}
                  <Blockquote
                    cite={null} // No visual cite line needed here
                    styles={{
                      root: { padding: 0, borderLeft: 'none' }, // Remove default padding and border of blockquote root
                      quote: { fontSize: theme.fontSizes.md, fontStyle: 'italic', color: quoteColor }
                    }}
                  >
                    {testimonial.quote}
                  </Blockquote>
                  <Group gap="sm" mt="md"> {/* Added gap and mt for spacing */}
                    <Avatar src={testimonial.avatarSrc} alt={testimonial.name} radius="xl" color="blue">
                      {/* Fallback initials if src is empty/null */}
                      {testimonial.name.split(" ").map(n => n[0]).join("")}
                    </Avatar>
                    <div>
                      <Text fw={600}>{testimonial.name}</Text>
                      <Text size="sm" c="dimmed">{testimonial.title}</Text>
                    </div>
                  </Group>
                </Stack>
              </Card>
            </GridCol>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
