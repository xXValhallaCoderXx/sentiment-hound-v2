// import PageLayout from "@/components/templates/PageLayout";
import { Loader, Flex, Title } from "@mantine/core";

const JobsLoadingPage = () => {
  return (
    <div>
      <Flex flex={1} justify="center" className="h-full">
        <Loader />
        <Title>Loading jobs...</Title>
      </Flex>
    </div>
  );
};

export default JobsLoadingPage;
