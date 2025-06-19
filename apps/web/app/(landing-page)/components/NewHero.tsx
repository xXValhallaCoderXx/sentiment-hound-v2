import { Button, Group, Container, Title, Text, Box } from '@mantine/core';

export const NewHero = () => {
  return (
    <Box
      component="section"
      id="hero"
      className="min-h-screen flex flex-col justify-center items-center text-center px-6 py-20"
    >
      <Container size="lg">
        <Title order={1} className="text-5xl font-bold text-gray-900 mb-6">
          Streamline Your Workflow, Amplify Your Results.
        </Title>
        <Text size="xl" className="text-gray-700 max-w-3xl mx-auto mb-10">
          Our intuitive platform empowers you to automate tedious tasks,
          manage complex projects seamlessly, and achieve your strategic
          goals faster than ever before.
        </Text>
        <Group justify="center" gap="md">
          <Button color="accent" size="lg" radius="md" variant="filled">
            Get Started Free
          </Button>
          <Button color="primary" size="lg" radius="md" variant="outline">
            Watch a Quick Video
          </Button>
        </Group>
        {/* Visual element (e.g., illustration or product mockup) will go here later */}
        {/* Example: <div className="mt-12 w-full max-w-4xl h-96 bg-gray-200 rounded-lg shadow-xl">Placeholder for Visual</div> */}
      </Container>
    </Box>
  );
};
