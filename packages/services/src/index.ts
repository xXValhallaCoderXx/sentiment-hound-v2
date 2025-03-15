import { prisma } from "@repo/db";
import { ProviderRepository } from "./providers/providers.repository";
import { CoreProviderService } from "./providers/providers.service";
import { IntegrationRepository } from "./integrations/integrations.repository";
import { CoreIntegrationService } from "./integrations/integrations.service";
import { YoutubeService } from "./youtube/youtube.services";
import { CorePostService } from "./posts/posts.service";
import { PostRepository } from "./posts/posts.repository";

// Create singleton instances of repositories
const providerRepository = new ProviderRepository(prisma);
const integrationRepository = new IntegrationRepository(prisma);
const postRepository = new PostRepository(prisma);

// Create singleton instances of services
export const providerService = new CoreProviderService(providerRepository);
export const integrationsService = new CoreIntegrationService(
  integrationRepository
);
export const postService = new CorePostService(postRepository);
export const youtubeService = new YoutubeService();


