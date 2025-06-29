import { prisma } from "@repo/db";
import { ProviderRepository } from "./providers/providers.repository";
import { CoreProviderService } from "./providers/providers.service";
import { IntegrationRepository } from "./integrations/integrations.repository";
import { CoreIntegrationService } from "./integrations/integrations.service";
import { YoutubeService } from "./youtube/youtube.services";
import { CorePostService } from "./posts/posts.service";
import { PostRepository } from "./posts/posts.repository";
import { QueueRepository } from "./queues/queues.repository";
import { CoreQueueService } from "./queues/queues.service";
import { CoreTaskService } from "./tasks/tasks.service";
import { SubTaskRepository } from "./sub-tasks/sub-tasks.repository";
import { CoreSubTaskService } from "./sub-tasks/sub-tasks.service";
import { CoreMentionService } from "./mentions/mentions.service";
import { MentionRepository } from "./mentions/mentions.repository";
import { UserRepository } from "./users/users.repository";
import { CoreUserService } from "./users/users.service";
import { PlanRepository } from "./plans/plans.repository";
import { CorePlanService } from "./plans/plans.service";
import { CoreExportService } from "./exports/exports.service";
import { TrackedKeywordService } from "./tracked-keywords/tracked-keywords.service";
import { RedditService } from "./reddit/reddit.services";
import { CompetitorRepository } from "./competitors/competitors.repository";
import { CoreCompetitorService } from "./competitors/competitors.service";
import { CoreDashboardService } from "./dashboard/dashboard.service";
import { InvitationTokenService } from "./invitation-tokens/invitation-tokens.service";
import { EarlyAccessService } from "./early-access/early-access.service";

export * from "./posts/post.interface";
export * from "./dashboard/dashboard.service";
export * from "./invitation-codes";
export * from "./plans/plans.types";

// Create singleton instances of repositories
const queueRepository = new QueueRepository(prisma);
const providerRepository = new ProviderRepository(prisma);
const integrationRepository = new IntegrationRepository(prisma);
const postRepository = new PostRepository(prisma);
const subtaskRepository = new SubTaskRepository(prisma);
const mentionRepository = new MentionRepository(prisma);
const userRepository = new UserRepository(prisma);
const planRepository = new PlanRepository(prisma);
const competitorRepository = new CompetitorRepository(prisma);

// Create singleton instances of services
export const providerService = new CoreProviderService(providerRepository);
export const integrationsService = new CoreIntegrationService(
  integrationRepository
);
export const postService = new CorePostService(postRepository);
export const youtubeService = new YoutubeService();
export const trackedKeywordService = new TrackedKeywordService();
export const redditService = new RedditService();
export const exportService = new CoreExportService();

export const queueService = new CoreQueueService(queueRepository);
export const taskService = new CoreTaskService(prisma);
export const subtaskService = new CoreSubTaskService(subtaskRepository);
export const mentionService = new CoreMentionService(mentionRepository);
export const userService = new CoreUserService(userRepository);
export const planService = new CorePlanService(planRepository);
export const competitorService = new CoreCompetitorService(
  competitorRepository
);
export const dashboardService = new CoreDashboardService(mentionRepository);
export const invitationTokenService = new InvitationTokenService(prisma);
export const earlyAccessService = new EarlyAccessService();

// Set up circular dependencies
integrationsService.setPlanService(planService);
trackedKeywordService.setPlanService(planService);
taskService.setPlanService(planService);
