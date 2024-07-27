import { IsNotEmpty } from "class-validator";
import { SyncType } from "database";

export class ICreateSyncDTO {
  @IsNotEmpty()
  integrationId: number;

  @IsNotEmpty()
  type: SyncType;

  @IsNotEmpty()
  taskId: number;
}

export class ICheckExistingIntegrationSyncDTO {
  @IsNotEmpty()
  integrationId: number;
}


export class IFullSyncUserIntegrationDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: SyncType;
}
