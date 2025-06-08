import {
  Task,
  TaskType,
  TaskStatus,
  SubTaskType,
  Prisma,
  prisma,
  PrismaClient,
} from "@repo/db";
import { subtaskService } from "..";

export class CoreTaskService {
  private model: Prisma.TaskDelegate;
  private planService: any; // Import type later to avoid circular dependencies

  constructor(private prisma: PrismaClient) {
    this.model = prisma.task;
  }

  setPlanService(planService: any) {
    this.planService = planService;
  }

  async getTask<T extends Prisma.TaskDefaultArgs>(
    args: Prisma.SelectSubset<T, Prisma.TaskFindFirstArgs>
  ): Promise<Prisma.TaskGetPayload<T>> {
    const task = await this.model.findFirst(args);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  async getTaskById(args?: Prisma.TaskFindFirstArgs) {
    const task = await this.model.findFirst(args);
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async getAllTasks<T extends Prisma.TaskDefaultArgs>(
    args?: Prisma.SelectSubset<T, Prisma.TaskFindManyArgs>
  ): Promise<Prisma.TaskGetPayload<T>[]> {
    const task = await this.model.findMany(args);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  }

  async getAllTasks2(args: Prisma.TaskDefaultArgs) {
    return this.model.findMany(args);
  }

  // async getAllTasks(): Promise<Task[]> {
  //   // Include jobs relation for each task
  //   return this.repository.findAll({ include: { subTasks: true } });
  // }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    const tasks = await this.model.findMany({ where: { userId } });
    return tasks;
  }

  async toggleTaskCompletion(id: number): Promise<Task> {
    // Validate task exists before toggling
    return await this.getTask({
      where: { id },
      include: { subTasks: { include: { subTaskMentions: true } } },
    });

    // return this.repository.toggleComplete(id);
  }

  async createTask({
    integrationId,
    taskType,
    userId,
    extraData,
  }: {
    userId: string;
    integrationId: number;
    taskType?: TaskType;
    extraData?: any;
  }): Promise<Task> {
    // Create the task first
    console.log("Sub Task Type: ", taskType);
    console.log("Sub Task integrationId: ", integrationId);
    console.log("Sub Task userId: ", userId);
    console.log("Sub Task extraData: ", extraData);
    const task = await this.model.create({
      data: {
        type: taskType || TaskType.OTHER,
        integrationId,
        userId,

        status: TaskStatus.PENDING,
      },
    });
    const integration = await prisma.integration.findUnique({
      where: { id: integrationId },
      include: { provider: true },
    });
    console.log("Sub Task CREATED: ", task);
    // Create appropriate jobs based on task type
    if (task.id) {
      switch (taskType) {
        case TaskType.ANALYZE_POST:
          console.log("Sub Task Type: ANALYZE_POST");

          if (integration?.provider.name === "reddit") {
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.FETCH_REDDIT_KEYWORD_MENTIONS,
              data: { integrationId, ...extraData },
            });

            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
              data: { integrationId },
            });

            // Create spam detection subtask if user has the feature
            if (this.planService && await this.planService.hasFeature(userId, 'spam_detection')) {
              await subtaskService.createSubTask({
                taskId: task.id,
                type: SubTaskType.DETECT_SPAM,
                data: { integrationId },
              });
            }
          }

          if (integration?.provider.name === "youtube") {
            // Full sync needs both fetching and analyzing
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT,
              data: { integrationId, ...extraData },
            });
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
              data: { integrationId },
            });

            // Create spam detection subtask if user has the feature
            if (this.planService && await this.planService.hasFeature(userId, 'spam_detection')) {
              await subtaskService.createSubTask({
                taskId: task.id,
                type: SubTaskType.DETECT_SPAM,
                data: { integrationId },
              });
            }
          }

          break;

        case TaskType.FULL_SYNC:
          console.log("Sub Task Type: FULL_SYNC");
          // Full sync needs both fetching and analyzing
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.FETCH_CONTENT,
            data: { integrationId },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId },
          });

          break;

        case TaskType.PARTIAL_SYNC:
          console.log("Sub Task Type: PARTIAL_SYNC");
          // Partial sync just needs to fetch new content
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.FETCH_CONTENT,

            data: { integrationId },
          });

          break;

        case TaskType.ANALYZE_COMMENTS:
          console.log("Sub Task Type: ANALYZE_COMMENTS");
          // Just need sentiment analysis
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.FETCH_CONTENT,
            data: { integrationId },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId },
          });
          break;

        case TaskType.EXPORT_DATA:
          console.log("Sub Task Type: EXPORT_DATA");
          // Export workflow: fetch data -> format data -> generate file
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.EXPORT_FETCH_DATA,
            data: { integrationId, ...extraData },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.EXPORT_FORMAT_DATA,
            data: { integrationId, ...extraData },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.EXPORT_GENERATE_FILE,
            data: { integrationId, ...extraData },
          });
          break;

        default:
          // For OTHER or unspecified types, no jobs are created
          console.log("Sub Task Type: OTHER");
          break;
      }
    }

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    // Update task with new status using repository update method
    return this.model.update({
      where: { id },
      data: { status },
    });
  }

  async getFilteredTasks(
    userId: string,
    filters: { status?: TaskStatus; type?: TaskType }
  ): Promise<Task[]> {
    return this.model.findMany({ where: { userId, ...filters } });
  }
}

// import {
//   Task,
//   TaskType,
//   TaskStatus,
//   SubTaskType,
//   Prisma,
//   PrismaClient,
// } from "@repo/db";
// import { TaskRepository } from "./tasks.repository";

// export class CoreTaskService {
//   constructor(
//     private repository: TaskRepository,
//     private prisma: PrismaClient
//   ) {}

//   async getTask<T extends Prisma.TaskDefaultArgs>(
//     args: Prisma.SelectSubset<T, Prisma.TaskFindFirstArgs>
//   ): Promise<Prisma.TaskGetPayload<T>> {
//     const task = await this.model.findFirst(args);
//     if (!task) {
//       throw new Error("Task not found");
//     }
//     return task;
//   }
//   async toggleTaskCompletion(id: number) {
//     // Validate task exists before toggling
//     const x = await this.getTask({
//       where: { id },
//       include: { subTasks: { include: { subTaskComments: true } } },
//     });

//     return x;

//     // return this.repository.toggleComplete(id);
//   }
// }
