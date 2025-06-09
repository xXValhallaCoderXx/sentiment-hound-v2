import { Button, Text, Title, Container, Paper, useMantineTheme } from '@mantine/core';
import classes from './FinalCTASection.module.css';

export function FinalCTASection() {
  const theme = useMantineTheme();

  return (
    <div className={classes.wrapper}>
      <Container size="md">
        <Paper
          className={classes.content}
          shadow="xl"
          p="xl"
          radius="lg"
          style={{
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.blue[0],
          }}
        >
          <Title order={2} ta="center" className={classes.title}>
            Start Making Sense of the Noise.
          </Title>
          <Text ta="center" mt="md" mb="xl" size="lg" c={theme.colorScheme === 'dark' ? 'dimmed' : theme.colors.gray[7]}>
            Unlock actionable insights from chaotic online conversations. Sentiment Hound helps you listen, understand, and act with clarity.
          </Text>
          <div className={classes.buttonWrapper}>
            <Button
              size="xl"
              variant="gradient"
              gradient={{ from: theme.colors.blue[6], to: theme.colors.cyan[5] }}
              className={classes.ctaButton}
              onClick={() => console.log('Get Your Invitation clicked')}
            >
              Get Your Invitation
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
}
