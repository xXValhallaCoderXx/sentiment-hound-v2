import { IsNotEmpty } from "class-validator";
import { SyncType } from "database";

export class ICreateSyncDTO {
  @IsNotEmpty()
  integrationId: number;

  @IsNotEmpty()
  type: SyncType;
}

export interface IFullSyncUserIntegrationDTO {
  userId: string;
  name: string;
}
