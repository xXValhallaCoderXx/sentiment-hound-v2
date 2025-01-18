import { JobType } from "database";

export class IGetUserJobs {
  userId: string;
}

export interface ICreateJob {
  integrationId: number;
  taskId: number;
  type: JobType;
}
