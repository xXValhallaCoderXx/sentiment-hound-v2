import PageLayout from "@/components/templates/PageLayout";
import { Loader, Flex, Title } from "@mantine/core";

const JobsLoadingPage = () => {
  return (
    <PageLayout title="Jobs">
      <Flex flex={1} justify="center" className="h-full">
        <Loader />
        <Title>Loading jobs...</Title>
      </Flex>
    </PageLayout>
  );
};

export default JobsLoadingPage;
