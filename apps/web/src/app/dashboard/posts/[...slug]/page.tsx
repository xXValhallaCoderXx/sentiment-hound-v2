import { integrationsService, postService } from "services";
import { auth } from "@/lib/next-auth.lib";

import { Box } from "@mantine/core";
import PostListView from "./PostListView";
import PostListTable from "./components/PostListTable";
import PostDetailDrawer from "./components/PostDetailDrawer";

const PostListPage = async ({
  params,
  searchParams,
}: {
  searchParams: any;
  params: { slug: string };
}) => {
  const session = await auth();
  const youtubeIntegration = await integrationsService.getUserIntegration(
    session?.user?.id as string,
    "youtube"
  );
  const integrationPosts = await postService.getUserIntegrationPosts({
    userId: session?.user?.id as string,
    integrationId: String(youtubeIntegration?.id),
  });

  return (
    <Box>
      <PostListTable data={integrationPosts} />
    </Box>
  );
};

export default PostListPage;
