import { prisma, SyncStatus } from "database";
import { ICreateSyncDTO } from "./sync.dto";

export class SyncRepository {
  async createSync(data: ICreateSyncDTO) {
    const { integrationId, type } = data;

    try {
      await prisma.sync.create({
        data: {
          integrationId,
          type: type,
          status: SyncStatus.IDLE,
          startedAt: new Date(),
          taskId: 1,
        },
      });
    } catch (error) {
      throw new Error("Error creating sync");
    }

  }
}

export const syncRepository = new SyncRepository();
