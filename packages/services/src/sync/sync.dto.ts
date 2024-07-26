import { SyncType } from "database";

export interface ICreateSyncDTO {
  integrationId: number;
  type: SyncType;
}

export interface IFullSyncUserIntegrationDTO {
  userId: string;
  name: string;
}
