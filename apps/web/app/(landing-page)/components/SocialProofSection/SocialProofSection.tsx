import { Avatar, Blockquote, Grid, Text, Title, Paper, useMantineTheme } from '@mantine/core';
import classes from './SocialProofSection.module.css';

// Mock data for testimonials - replace with real data or props later
const testimonials = [
  {
    quote: "Sentiment Hound has revolutionized how we understand our customers. The clarity it brings to online conversations is unparalleled.",
    name: "Jane Doe",
    title: "CMO",
    company: "Innovatech Solutions",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The real-time dashboard and competitor tracking are game-changers. We're more agile and informed than ever before.",
    name: "John Smith",
    title: "Product Lead",
    company: "Synergy Corp",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote: "Filtering out the noise and focusing on genuine sentiment has saved us countless hours. Highly recommended!",
    name: "Alice Brown",
    title: "Community Manager",
    company: "Future Forward Inc.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export function SocialProofSection() {
  const theme = useMantineTheme();

  const testimonialCardStyle = {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    height: '100%',
  };

  return (
    <div className={classes.wrapper}>
      <Title order={2} ta="center" className={classes.title}>
        Trusted by the most innovative teams.
      </Title>
      <Grid gutter="xl" align="stretch">
        {testimonials.map((testimonial, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
            <Paper style={testimonialCardStyle} shadow="sm" radius="md" withBorder className={classes.testimonialCard}>
              <Blockquote
                color={theme.primaryColor}
                cite={
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: theme.spacing.sm }}>
                    <Avatar src={testimonial.avatar} alt={testimonial.name + "'s avatar"} radius="xl" size="lg" mr="md" />
                    <div>
                      <Text fw={600} size="sm">{testimonial.name}</Text>
                      <Text size="xs" c="dimmed">{testimonial.title}, {testimonial.company}</Text>
                    </div>
                  </div>
                }
                icon={null}
                className={classes.blockquote}
              >
                <Text size="sm" lh="md">{testimonial.quote}</Text>
              </Blockquote>
            </Paper>
          </Grid.Col>
        ))}
      </Grid>
    </div>
  );
}
