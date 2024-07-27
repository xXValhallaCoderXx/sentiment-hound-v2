import {
  IntegrationsRepository,
  integrationsRepository,
} from "../integrations/integrations.repository";
import { SyncType } from "database";
import { SyncRepository, syncRepository } from "./sync.repository";
import { ICreateSyncDTO, IFullSyncUserIntegrationDTO } from "./sync.dto";
import { NotFoundError } from "../errors";

class SyncService {
  private integrationsRepository: IntegrationsRepository;

  constructor(integrationsRepository: IntegrationsRepository) {
    this.integrationsRepository = integrationsRepository;
  }

  async fullSyncUserIntegration(data: IFullSyncUserIntegrationDTO) {
    console.log("FULL SYNC USER INTEGRATION", data);
    const getUserIntegration =
      await this.integrationsRepository.getUserIntegration(
        data.userId,
        data.name
      );

    console.log("USER INTEGRATION", getUserIntegration);

    if (!getUserIntegration) {
      throw new NotFoundError("Integration not found");
    }

    const heh = syncRepository.helloWorld();

    // const sync = this.syncRepository.createSync({
    //   integrationId: getUserIntegration.id,
    //   type: SyncType.FULL,
    // });

    return {
      blah: "laa",
    };
  }
}

export const syncService = new SyncService(integrationsRepository);
