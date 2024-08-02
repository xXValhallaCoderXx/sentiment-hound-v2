import { SyncType } from "database";
import { IsNotEmpty } from "class-validator";

export class IGetUserJobsDTO {
  @IsNotEmpty()
  userId: string;
}



export interface ICreateJobDTO {
  integrationId: number;
  type: SyncType;
}
