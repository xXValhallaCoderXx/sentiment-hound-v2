import { prisma } from "database";
import { ICreateSyncDTO, ICheckExistingIntegrationSyncDTO } from "./sync.dto";

export class SyncRepository {
  async getAllSyncs() {
    return await prisma.sync.findMany();
  }

  async getUserSyncForIntegration(data: ICheckExistingIntegrationSyncDTO) {
    const { integrationId } = data;
    return await prisma.sync.findFirst({
      where: {
        integrationId,
        status: "IDLE",
      },
    });
  }

  async createSync(data: ICreateSyncDTO) {
    const { integrationId, type, providerId } = data;
    try {
      return await prisma.sync.create({
        data: {
          integrationId,
          type: type,
          status: "IDLE",
          startedAt: new Date(),
          taskId: 1,
          providerId,
        },
      });
    } catch (error) {
      console.log("Error creating sync", error);
      return null;
    }
  }
}

export const syncRepository = new SyncRepository();
