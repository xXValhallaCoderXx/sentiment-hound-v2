import { Container, Title, Text, Grid, Card, ThemeIcon, Stack, Box } from '@mantine/core';
import { IconCircleCheck, IconChartBar, IconArrowsClockwise, IconUsers } from '@tabler/icons-react'; // Using Tabler icons

const featuresData = [
  {
    icon: IconChartBar, // Specific icon for Dashboards
    title: "Customizable Data Dashboards",
    description: "Visualize your critical data in real-time with dashboards you can tailor to your exact needs. Gain instant insights and make informed decisions faster by seeing the metrics that matter most to your business, all in one place.",
  },
  {
    icon: IconArrowsClockwise, // Specific icon for Automation
    title: "Seamless Workflow Automation",
    description: "Connect your existing tools and automate complex, multi-step processes effortlessly with our intuitive drag-and-drop workflow builder. Reduce manual data entry, eliminate human errors, and ensure operational consistency while freeing up your team for more strategic initiatives.",
  },
  {
    icon: IconUsers, // Specific icon for Collaboration
    title: "Collaborative Workspaces",
    description: "Bring your team members, data, and projects together in dynamic shared workspaces designed for real-time collaboration and complete transparency. Assign tasks, share critical files, provide feedback, and track progress effortlessly, ensuring everyone is aligned, no matter their location.",
  },
];

export const KeyFeatures = () => {
  const items = featuresData.map((feature) => (
    <Grid.Col span={12} md={4} key={feature.title}>
      <Card shadow="sm" radius="md" padding="xl" withBorder sx={{ height: '100%' }}> {/* Ensure cards in a row have same height */}
        <Stack align="center" spacing="lg" sx={{ textAlign: 'center' }}> {/* Centered text in stack */}
          <ThemeIcon size={60} radius="xl" variant="light" color="primary">
            {/* 'primary' is our newBlue. */}
            <feature.icon size={32} strokeWidth={1.5} />
          </ThemeIcon>
          <Title order={3} > {/* Removed align="center" as Stack handles it */}
            {feature.title}
          </Title>
          <Text size="sm" color="dimmed" sx={{ lineHeight: 1.6 }}> {/* Removed align="center" */}
            {feature.description}
          </Text>
        </Stack>
      </Card>
    </Grid.Col>
  ));

  return (
    <Box component="section" py="xl" sx={(theme) => ({
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0], // Light gray background
    })}>
      <Container size="lg" py="xl">
        <Title order={2} align="center" mb="xl">
          Everything You Need to Succeed
        </Title>
        <Grid gutter="xl" align="stretch">{items}</Grid> {/* Added align="stretch" to make columns in a row equal height by default */}
      </Container>
    </Box>
  );
};
