import {
  IntegrationsRepository,
  integrationsRepository,
} from "../integrations/integrations.repository";
import { SyncType } from "database";

class JobService {
  async fullSyncUserIntegration(data: any) {
    return "";
  }
}

export const jobService = new JobService();
