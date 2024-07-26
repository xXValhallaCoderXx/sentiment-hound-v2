import {
  IntegrationsRepository,
  integrationsRepository,
} from "../integrations/integrations.repository";
import { SyncType } from "database";
import { SyncRepository, syncRepository } from "./sync.repository";
import { ICreateSyncDTO, IFullSyncUserIntegrationDTO } from "./sync.dto";

class SyncService {
  private integrationsRepository: IntegrationsRepository;
  private syncRepository: SyncRepository;

  constructor(
    integrationsRepository: IntegrationsRepository,
    syncRepository: SyncRepository
  ) {
    this.integrationsRepository = integrationsRepository;
    this.syncRepository = syncRepository;
  }

  async fullSyncUserIntegration(data: IFullSyncUserIntegrationDTO) {
    const getUserIntegration =
      await this.integrationsRepository.getUserIntegration(
        data.userId,
        data.name
      );

    if (!getUserIntegration) {
      throw new Error("Integration not found");
    }

    const sync = await this.syncRepository.createSync({
      integrationId: getUserIntegration.id,
      type: SyncType.FULL,
    });

    return "";
  }
}

export const syncService = new SyncService(
  integrationsRepository,
  syncRepository
);
