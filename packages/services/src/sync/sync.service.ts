import {
  IntegrationsRepository,
  integrationsRepository,
} from "../integrations/integrations.repository";
import { SyncType, TaskType } from "database";
import { taskService, TaskService } from "../task/task.service";
import { SyncRepository, syncRepository } from "./sync.repository";
import { IFullSyncUserIntegrationDTO } from "./sync.dto";
import { NotFoundError, BadRequestError } from "../errors";

class SyncService {
  constructor(
    private integrationsRepository: IntegrationsRepository,
    private syncRepository: SyncRepository,
    private taskService: TaskService
  ) {
    this.integrationsRepository = integrationsRepository;
    this.syncRepository = syncRepository;
    this.taskService = taskService;
  }
  async fullSyncUserIntegration(data: IFullSyncUserIntegrationDTO) {
    const integration = await this.integrationsRepository.getUserIntegration(
      data.userId,
      data.name
    );

    if (!integration) {
      throw new NotFoundError(`${data.name} integration not found`);
    }

    const existingSync = await this.syncRepository.getUserSyncForIntegration({
      integrationId: integration.id,
    });

    if (existingSync) {
      throw new BadRequestError(
        "You have an exisiting sync, please check your jobs"
      );
    }

    const newTask = await this.taskService.createUserTask({
      userId: data.userId,
      type: TaskType.OTHER,
    });

    if (!newTask) {
      throw new BadRequestError("Task not able to be created");
    }

    const newSync = await this.syncRepository.createSync({
      integrationId: integration.id,
      type: SyncType.FULL,
      taskId: newTask.id,
    });
    console.log("SYNC TASK", newSync);
    return {
      hello: "world",
    };
  }

  async checkIfSyncExistsForUserIntegration({
    integrationId,
    userId,
  }: {
    integrationId: number;
    userId: number;
  }) {
    // Check if sync exists for user integration
    const integration = await this.integrationsRepository.findFirst({
      where: {
        id: integrationId,
        userId: userId,
      },
    });

    if (!integration) {
      throw new NotFoundError("Integration not found for this user");
    }

    // const idleSync = await prisma.sync.findFirst({
    //   where: {
    //     integrationId: integrationId,
    //     status: 'IDLE',
    //   },
    // });
  }
}

export const syncService = new SyncService(
  integrationsRepository,
  syncRepository,
  taskService
);

// class SyncService {


//   constructor(integrationsRepository: IntegrationsRepository) {
//     this.integrationsRepository = integrationsRepository;
//   }

//   async fullSyncUserIntegration(data: IFullSyncUserIntegrationDTO) {
//     console.log("FULL SYNC USER INTEGRATION", data);
    // const getUserIntegration =
    //   await this.integrationsRepository.getUserIntegration(
    //     data.userId,
    //     data.name
    //   );

    // console.log("USER INTEGRATION", getUserIntegration);

//     if (!getUserIntegration) {
//       throw new NotFoundError("Integration not found");
//     }

//     const heh = syncRepository.helloWorld();

//     // const sync = this.syncRepository.createSync({
//     //   integrationId: getUserIntegration.id,
//     //   type: SyncType.FULL,
//     // });

//     return {
//       blah: "laa",
//     };
//   }
// }

// export const syncService = new SyncService(integrationsRepository);
