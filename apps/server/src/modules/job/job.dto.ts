import { IsNotEmpty } from 'class-validator';
import { JobType } from 'database';
import { IGetUserJobs } from 'services/src/job/job.interface';

export class IGetUserJobsDTO implements IGetUserJobs {
  @IsNotEmpty()
  userId: string;
}

export interface ICreateJobDTO {
  integrationId: number;
  taskId: number;
  type: JobType;
}
