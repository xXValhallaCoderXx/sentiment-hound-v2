import { prisma } from "database";
import { DatabaseError } from "../errors";
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
    const { integrationId, type, providerId, taskId } = data;
    try {
      return await prisma.sync.create({
        data: {
          integrationId,
          type: type,
          status: "IDLE",
          startedAt: new Date(),
          taskId,
          providerId,
        },
      });
    } catch (error) {
      console.log("Error creating sync entry", error);
      throw new DatabaseError("Error creating sync");
    }
  }

  async deleteSyncByTaskId(taskId: number) {
    try {
      return await prisma.sync.deleteMany({
        where: {
          taskId,
        },
      });
    } catch (error) {
      console.log("Error deleting sync", error);
      return null;
    }
  }
}

export const syncRepository = new SyncRepository();
