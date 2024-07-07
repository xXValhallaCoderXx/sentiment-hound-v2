import PageLayout from "@/components/templates/PageLayout";
import { integrationsService, youtubeService } from "services";
import { auth } from "@/lib/next-auth.lib";
import NoData from "@/components/molecules/NoData";
import { Box, Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";

const PostsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);
  const youtubeServiceData = await youtubeService.fetchYoutubePosts(userId);
  console.log("Integrations", integrations);
  return (
    <PageLayout title="Posts">
      {integrations.length === 0 ? (
        <NoData
          title="No Integrations Found"
          description="Please integrate a social media account"
        />
      ) : (
        <Box>
          <Tabs defaultValue="gallery">
            <TabsList>
              <TabsTab value="gallery">Gallery</TabsTab>
              <TabsTab value="messages">Messages</TabsTab>
              <TabsTab value="settings">Settings</TabsTab>
            </TabsList>

            <TabsPanel value="gallery">Gallery tab content</TabsPanel>

            <TabsPanel value="messages">Messages tab content</TabsPanel>

            <TabsPanel value="settings">Settings tab content</TabsPanel>
          </Tabs>
        </Box>
      )}
    </PageLayout>
  );
};

export default PostsPage;
