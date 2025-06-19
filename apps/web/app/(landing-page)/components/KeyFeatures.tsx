import { Container, Title, Text, Grid, GridCol, Card, ThemeIcon, Stack, Box, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconChartBar, IconArrowsClockwise, IconUsers } from '@tabler/icons-react';

const featuresData = [
  {
    icon: IconChartBar,
    title: "Customizable Data Dashboards",
    description: "Visualize your critical data in real-time with dashboards you can tailor to your exact needs. Gain instant insights and make informed decisions faster by seeing the metrics that matter most to your business, all in one place.",
  },
  {
    icon: IconArrowsClockwise,
    title: "Seamless Workflow Automation",
    description: "Connect your existing tools and automate complex, multi-step processes effortlessly with our intuitive drag-and-drop workflow builder. Reduce manual data entry, eliminate human errors, and ensure operational consistency while freeing up your team for more strategic initiatives.",
  },
  {
    icon: IconUsers,
    title: "Collaborative Workspaces",
    description: "Bring your team members, data, and projects together in dynamic shared workspaces designed for real-time collaboration and complete transparency. Assign tasks, share critical files, provide feedback, and track progress effortlessly, ensuring everyone is aligned, no matter their location.",
  },
];

export const KeyFeatures = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const items = featuresData.map((feature) => (
    <GridCol span={{ base: 12, md: 4 }} key={feature.title}> {/* Updated span for responsiveness */}
      <Card shadow="sm" radius="md" padding="xl" withBorder h="100%"> {/* explicit height 100% for card */}
        <Stack align="center" spacing="lg">
          <ThemeIcon size={60} radius="xl" variant="light" color="primary">
            <feature.icon size={32} strokeWidth={1.5} />
          </ThemeIcon>
          <Title order={3} ta="center">
            {feature.title}
          </Title>
          <Text size="sm" c="dimmed" lh={1.6} ta="center"> {/* Used c="dimmed" for color */}
            {feature.description}
          </Text>
        </Stack>
      </Card>
    </GridCol>
  ));

  return (
    <Box
      component="section"
      py="xl"
      bg={colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}
    >
      <Container size="lg" py="xl">
        <Title order={2} ta="center" mb="xl">
          Everything You Need to Succeed
        </Title>
        <Grid gutter="xl" align="stretch">{items}</Grid>
      </Container>
    </Box>
  );
};
