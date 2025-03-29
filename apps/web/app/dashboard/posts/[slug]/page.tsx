import { integrationsService, postService } from "@repo/services";
import { auth } from "@/lib/next-auth.lib";
import { Box, Flex } from "@mantine/core";
import PostListTable from "./components/PostListTable";
import ActionPanel from "./components/ActionPanel";

const PostListPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  // Get the current authenticated user
  const session = await auth();
  if (!session?.user?.id) {
    return <Box>You must be logged in to view this page</Box>;
  }

  try {
    // Get the integration for this specific provider
    const currentIntegration =
      await integrationsService.getUserIntegrationByName(session.user.id, slug);

    if (!currentIntegration) {
      // If the provider exists but user doesn't have this integration
      return (
        <Box className="p-4">
          <h3>Integration not set up</h3>
          <p>You haven't connected your {slug} account yet.</p>
        </Box>
      );
    }

    const computedPosts = await postService.getComputedIntegrationList({
      userId: session.user.id,
      integrationId: currentIntegration.id,
    });

    return (
      <Box p={16}>
        <Box className="mt-4">
          <ActionPanel providerId={currentIntegration.id} name={slug} />
        </Box>
        {computedPosts?.length > 0 ? (
          <PostListTable data={computedPosts} />
        ) : (
          <Flex justify="center">No posts found for this provider.</Flex>
        )}
      </Box>
    );
  } catch (error) {
    console.error(`Error fetching data for provider ${slug}:`, error);
    return <Box>There was an error loading your {slug} posts.</Box>;
  }
};

// Generate static params for providers that you know exist
export async function generateStaticParams() {
  // This helps with static generation for known providers
  return [
    { slug: "youtube" },
    { slug: "facebook" },
    { slug: "instagram" },
    { slug: "twitter" },
  ];
}

export default PostListPage;
