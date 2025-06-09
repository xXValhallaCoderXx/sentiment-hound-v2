import { Card, Grid, Text, Title, useMantineTheme } from '@mantine/core';
import classes from './BentoGridSection.module.css';

const PlaceholderVisual = ({ height = 100, minHeight = 75 }: { height?: number, minHeight?:number }) => {
  const theme = useMantineTheme(); // Access theme here for placeholder styling
  return (
    <div style={{
      height,
      minHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.sm,
      backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', // Use theme for bg
      width: '100%'
    }}>
      <Text c="dimmed" fz="xs">(Visual Placeholder)</Text>
    </div>
  );
};

export function BentoGridSection() {
  const theme = useMantineTheme();
  const cardStyle = {
    backgroundColor: theme.colorScheme === 'dark' ? 'rgba(26, 27, 30, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px) saturate(1.2)',
    WebkitBackdropFilter: 'blur(16px) saturate(1.2)', // Safari support
    padding: theme.spacing.lg,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, // Escaped backticks here
    boxShadow: theme.colorScheme === 'dark' ? '0 8px 20px rgba(0,0,0,0.35)' : '0 6px 16px rgba(0,0,0,0.08)',
    height: '100%', // Ensure cards fill their grid cell height
  };

  return (
    <div className={classes.wrapper}>
      <Grid gutter="lg" align="stretch"> {/* align="stretch" helps cards in same row have same height */}
        {/* Card 1 (Large) - Spanning more width */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Card style={cardStyle} className={classes.card}>
            <PlaceholderVisual height={300} minHeight={200} />
            <Title order={3} mt="lg">Your Sentiment, In Real-Time.</Title>
            <Text mt="sm" size="sm" c="dimmed">A slow, elegant animation of the "My Brand" Dashboard chart.</Text>
          </Card>
        </Grid.Col>

        {/* Right column for the other 3 cards */}
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Grid gutter="lg">
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card style={cardStyle} className={classes.card}>
                <PlaceholderVisual />
                <Title order={5} mt="md">See The Full Picture.</Title>
                <Text mt="xs" size="xs" c="dimmed">A simplified animation of two competing trend lines.</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6 }}>
              <Card style={cardStyle} className={classes.card}>
                <PlaceholderVisual />
                <Title order={5} mt="md">Clarity, Not Clutter.</Title>
                <Text mt="xs" size="xs" c="dimmed">An animation of messy icons being filtered, leaving clean ones.</Text>
              </Card>
            </Grid.Col>
            <Grid.Col span={12}>
              <Card style={cardStyle} className={classes.card}>
                <PlaceholderVisual />
                <Title order={5} mt="md">From "What" to "What's Next".</Title>
                <Text mt="xs" size="xs" c="dimmed">A simple icon of a lightbulb or a magic wand.</Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid>
    </div>
  );
}
