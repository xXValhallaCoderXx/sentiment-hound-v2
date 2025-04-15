import { FC, Suspense } from "react";
import JobDetail from "./JobDetail";
import JobDetailDrawerClient from "./JobDetailClient";

interface IJobDetailDrawerProps {
  jobId: string;
}

const JobDetailDrawer: FC<IJobDetailDrawerProps> = ({ jobId }) => {
  return (
    <JobDetailDrawerClient jobId={jobId}>
      <Suspense fallback={<div>Loading</div>}>
        <JobDetail jobId={jobId} />
      </Suspense>
    </JobDetailDrawerClient>
  );
};

export default JobDetailDrawer;
