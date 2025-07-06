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
import { urlParserService } from "..";
import { integrationsService } from "..";
import { providerService } from "..";
import {
  Provider,
  ParseResult,
  InvalidUrlError,
  UnsupportedProviderError,
} from "../url-parser";

export class CoreTaskService {
  private model: Prisma.TaskDelegate;
  private planService: any; // Import type later to avoid circular dependencies

  constructor(private prisma: PrismaClient) {
    this.model = this.prisma.task;
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
    providerId,
    taskType,
    userId,
    extraData,
  }: {
    userId: string;
    integrationId?: number | null;
    providerId?: number | null;
    taskType?: TaskType;
    extraData?: any;
  }): Promise<Task> {
    console.log("Sub Task Type: ", taskType);
    console.log("Sub Task integrationId: ", integrationId);
    console.log("Sub Task providerId: ", providerId);
    console.log("Sub Task userId: ", userId);
    console.log("Sub Task extraData: ", extraData);

    // Check if URL is provided in extraData for URL-driven task creation
    let parsedProvider: Provider | null = null;
    let normalizedUrl: string | null = null;
    let urlMetadata: any = null;
    let resolvedProviderId: number | null = providerId || null;

    if (extraData?.url) {
      try {
        console.log(
          "URL detected in extraData, attempting to parse:",
          extraData.url
        );
        const parseResult: ParseResult = urlParserService.parse(extraData.url);
        parsedProvider = parseResult.provider;
        normalizedUrl = parseResult.url;
        urlMetadata = parseResult.metadata;

        console.log("URL parsed successfully:", {
          provider: parsedProvider,
          normalizedUrl,
          metadata: urlMetadata,
        });

        // Resolve provider ID from parsed provider name if not already provided
        if (!resolvedProviderId && parsedProvider) {
          try {
            const providerRecord = await providerService.getProviderByName(parsedProvider);
            resolvedProviderId = providerRecord.id;
            console.log(`Resolved provider ID ${resolvedProviderId} for provider ${parsedProvider}`);
          } catch (error) {
            console.error(`Failed to resolve provider ID for ${parsedProvider}:`, error);
            throw new Error(`Unsupported provider: ${parsedProvider}`);
          }
        }

        // Update extraData with normalized URL for downstream processors
        extraData = {
          ...extraData,
          url: normalizedUrl,
          originalUrl: extraData.url,
          metadata: urlMetadata,
        };
      } catch (error) {
        console.error("URL parsing failed:", error);

        // If URL parsing fails but integrationId is provided, continue with fallback
        if (!integrationId) {
          throw new Error(
            `URL parsing failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }

        console.log(
          "URL parsing failed, falling back to integration-based approach"
        );
      }
    }

    // If we still don't have a providerId, try to resolve from integrationId
    if (!resolvedProviderId && integrationId) {
      try {
        const integration = await this.prisma.integration.findUnique({
          where: { id: integrationId },
          include: { provider: true },
        });
        
        if (integration) {
          resolvedProviderId = integration.providerId;
          console.log(`Resolved provider ID ${resolvedProviderId} from integration ${integrationId}`);
        }
      } catch (error) {
        console.error("Failed to resolve provider from integration:", error);
      }
    }

    // Validate that we have a providerId
    if (!resolvedProviderId) {
      throw new Error("Provider ID is required. Unable to resolve provider from URL or integration.");
    }

    // Create the task first - handle API key authentication (integrationId = 0 or null) by omitting the field
    const taskData: any = {
      type: taskType || TaskType.OTHER,
      userId,
      providerId: resolvedProviderId,
      status: TaskStatus.PENDING,
    };

    // Only set integrationId if it's provided and not 0 (API key auth)
    if (integrationId && integrationId !== 0) {
      taskData.integrationId = integrationId;
    }

    const task = await this.model.create({
      data: taskData,
    });

    // Enhanced integration lookup: Use provider-based lookup if we have a parsed provider
    let integration: any = null;

    // Check if we're using API key/master token authentication (integrationId = 0 or null with token in extraData)
    const isApiKeyAuth = (!integrationId || integrationId === 0) && extraData?.token;

    if (isApiKeyAuth) {
      console.log(
        `API key/master token authentication detected for provider: ${parsedProvider}. Skipping database integration lookup.`
      );
      // Create a mock integration object for compatibility with downstream code
      integration = {
        id: 0,
        provider: {
          name: parsedProvider || "unknown",
        },
        accessToken: extraData.token,
        isActive: true,
      };
    } else if (parsedProvider) {
      console.log(
        `Looking up integration for parsed provider: ${parsedProvider}`
      );
      try {
        integration = await integrationsService.getUserIntegrationByName(
          userId,
          parsedProvider
        );

        if (!integration) {
          console.error(
            `No integration found for provider ${parsedProvider} and user ${userId}`
          );

          // Mark task as failed if no integration found for detected provider
          await this.model.update({
            where: { id: task.id },
            data: { status: TaskStatus.FAILED },
          });

          throw new Error(
            `No integration found for ${parsedProvider}. Please connect your ${parsedProvider} account first.`
          );
        }

        console.log(`Found integration for ${parsedProvider}:`, integration.id);

        // Update the task with the correct integrationId if it was different
        if (integration.id !== integrationId) {
          await this.model.update({
            where: { id: task.id },
            data: { integrationId: integration.id },
          });
          console.log(
            `Updated task integration from ${integrationId} to ${integration.id}`
          );
        }
      } catch (error) {
        console.error("Provider-based integration lookup failed:", error);
        throw error;
      }
    } else if (integrationId && integrationId !== 0) {
      // Fallback to original integration lookup by ID
      console.log(`Using fallback integration lookup for ID: ${integrationId}`);
      integration = await this.prisma.integration.findUnique({
        where: { id: integrationId },
        include: { provider: true },
      });

      if (!integration) {
        console.error(`No integration found with ID ${integrationId}`);

        await this.model.update({
          where: { id: task.id },
          data: { status: TaskStatus.FAILED },
        });

        throw new Error(`Integration with ID ${integrationId} not found.`);
      }
    }

    console.log("Sub Task CREATED: ", task);
    console.log("Integration found: ", integration);
    // Create appropriate jobs based on task type
    if (task.id) {
      switch (taskType) {
        case TaskType.ANALYZE_POST:
          console.log("Sub Task Type: ANALYZE_POST");

          if (integration?.provider.name === "reddit") {
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.FETCH_REDDIT_KEYWORD_MENTIONS,
              data: { integrationId: integration.id, ...extraData },
            });

            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
              data: { integrationId: integration.id },
            });

            // Create spam detection subtask if user has the feature
            if (
              this.planService &&
              (await this.planService.hasFeature(userId, "spam_detection"))
            ) {
              await subtaskService.createSubTask({
                taskId: task.id,
                type: SubTaskType.DETECT_SPAM,
                data: { integrationId: integration.id },
              });
            }
          }

          // URL-driven approach: Use parsed provider if available, otherwise fall back to integration provider
          const effectiveProvider =
            parsedProvider || integration?.provider.name;
          console.log(
            "Effective provider for task creation:",
            effectiveProvider
          );

          if (effectiveProvider === "youtube") {
            console.log("Creating YouTube-specific subtasks");
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.FETCH_INDIVIDUAL_POST_CONTNENT,
              data: { integrationId: integration?.id || 0, ...extraData },
            });
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
              data: { integrationId: integration?.id || 0 },
            });

            // Create spam detection subtask if user has the feature
            if (
              this.planService &&
              (await this.planService.hasFeature(userId, "spam_detection"))
            ) {
              await subtaskService.createSubTask({
                taskId: task.id,
                type: SubTaskType.DETECT_SPAM,
                data: { integrationId: integration?.id || 0 },
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
            data: { integrationId: integration?.id || 0 },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId: integration?.id || 0 },
          });

          // Create spam detection subtask if user has the feature
          if (
            this.planService &&
            (await this.planService.hasFeature(userId, "spam_detection"))
          ) {
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.DETECT_SPAM,
              data: { integrationId: integration?.id || 0 },
            });
          }

          break;

        case TaskType.PARTIAL_SYNC:
          console.log("Sub Task Type: PARTIAL_SYNC");
          // Partial sync just needs to fetch new content
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.FETCH_CONTENT,
            data: { integrationId: integration?.id || 0 },
          });

          break;

        case TaskType.ANALYZE_COMMENTS:
          console.log("Sub Task Type: ANALYZE_COMMENTS");
          // Just need sentiment analysis
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.FETCH_CONTENT,
            data: { integrationId: integration?.id || 0 },
          });
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.ANALYZE_CONTENT_SENTIMENT,
            data: { integrationId: integration?.id || 0 },
          });

          // Create spam detection subtask if user has the feature
          if (
            this.planService &&
            (await this.planService.hasFeature(userId, "spam_detection"))
          ) {
            await subtaskService.createSubTask({
              taskId: task.id,
              type: SubTaskType.DETECT_SPAM,
              data: { integrationId: integration?.id || 0 },
            });
          }
          break;

        case TaskType.EXPORT_DATA:
          console.log("Sub Task Type: EXPORT_DATA");
          // Export workflow: fetch data -> format data -> generate file
          await subtaskService.createSubTask({
            taskId: task.id,
            type: SubTaskType.EXPORT_FETCH_DATA,
            data: { integrationId: integration?.id || 0, ...extraData },
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
