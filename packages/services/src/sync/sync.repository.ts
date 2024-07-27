import { prisma, SyncStatus } from "database";
import { ICreateSyncDTO } from "./sync.dto";

export class SyncRepository {
  createSync(data: ICreateSyncDTO) {
    console.log("PRISMASYNC", prisma);
    // try {
    //   await prisma.sync.create({
    //     data: {
    //       integrationId,
    //       type: type,
    //       status: SyncStatus.IDLE,
    //       startedAt: new Date(),
    //       taskId: 1,
    //     },
    //   });
    // } catch (error) {
    //   throw new Error(error);
    // }
    return "hello";
  }

  helloWorld() {
    console.log("PRISMASYNC", prisma);
    return "hello";
  }
}

export const syncRepository = new SyncRepository();
