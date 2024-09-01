import { IsNotEmpty } from "class-validator";
import { TaskStatus } from "database";

export class IGetUserJobsDTO {
  @IsNotEmpty()
  userId: string;
}

export interface ICreateJobDTO {
  integrationId: number;
  taskId: number;
}
