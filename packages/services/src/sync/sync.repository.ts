import { prisma } from "database";
import { ICreateSyncDTO } from "./sync.dto";

export class SyncRepository {
  async getAllSyncs() {
    return await prisma.sync.findMany();
  }

  async createSync(data: ICreateSyncDTO) {
    const { integrationId, type } = data;
    return await prisma.sync.create({
      data: {
        integrationId,
        type: type,
        status: "IDLE",
        startedAt: new Date(),
        taskId: 1,
      },
    });
  }
}

export const syncRepository = new SyncRepository();
