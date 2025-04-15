import { taskService } from "@repo/services";
import { FC } from "react";

interface JobDetailProps {
  jobId: string;
}

const JobDetail: FC<JobDetailProps> = async ({ jobId }) => {
  if (!jobId) return null;

  const x = await taskService.getTask(Number(jobId));
  return <div>{x.id}</div>;
};

export default JobDetail;
