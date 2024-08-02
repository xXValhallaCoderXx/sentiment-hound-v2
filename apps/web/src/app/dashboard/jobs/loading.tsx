import { Loader } from "@mantine/core";

const JobsLoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader />
      <div className="mt-4 text-lg font-semibold text-gray-800">
        Loading jobs...
      </div>
    </div>
  );
};

export default JobsLoadingPage;
