import { IsNotEmpty } from "class-validator";
import { JobType } from "database";

export class IGetUserJobsDTO {
  @IsNotEmpty()
  userId: string;
}

export interface ICreateJobDTO {
  integrationId: number;
  taskId: number;
  type: JobType;
}
