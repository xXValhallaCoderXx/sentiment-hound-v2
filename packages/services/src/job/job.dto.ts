import { SyncType } from "database";

export interface ICreateJobDTO {
  integrationId: number;
  type: SyncType;
}
