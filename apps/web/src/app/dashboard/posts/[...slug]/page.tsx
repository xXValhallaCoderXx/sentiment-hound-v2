import { integrationsService, postService } from "services";
import { auth } from "@/lib/next-auth.lib";

import { Box } from "@mantine/core";
import PostListView from "./PostListView";
import PostListTable from "./components/PostListTable";
import PostDetailDrawer from "./components/PostDetailDrawer";
import ActionPanel from "./components/ActionPanel";

const PostListPage = async ({
  params,
}: {
  searchParams: any;
  params: { slug: string };
}) => {
  const slug = params.slug;
  const session = await auth();
  const currentIntegration = await integrationsService.getUserIntegration(
    session?.user?.id as string,
    slug[0]
  );
  const integrationPosts = await postService.getUserIntegrationPosts({
    userId: session?.user?.id as string,
    integrationId: String(currentIntegration?.id),
  });

  return (
    <Box>
      <Box className="mt-4">
        <ActionPanel name={currentIntegration?.provider.name ?? ""} />
      </Box>
      <PostListTable data={integrationPosts} />
    </Box>
  );
};

export default PostListPage;
