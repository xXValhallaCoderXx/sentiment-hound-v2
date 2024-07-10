import { redirect } from "next/navigation";
import PageLayout from "@/components/templates/PageLayout";
import { integrationsService, youtubeService } from "services";
import { auth } from "@/lib/next-auth.lib";
import NoData from "@/components/molecules/NoData";
import { Box, Tabs, TabsList, TabsTab, TabsPanel } from "@mantine/core";

const PostsPage = async ({ children, params, ...rest }: any) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);

  const socialIntegrations = integrations.map(
    (integration) => integration.provider.name
  );

  if (Object.keys(params).length === 0) {
    console.log("NO PARAMS", rest);
    // redirect(`/dashboard/posts/${socialIntegrations[0]}`);
  }

  return (
    <PageLayout title="Posts">
      {integrations.length === 0 ? (
        <NoData
          title="No Integrations Found"
          description="Please integrate a social media account"
        />
      ) : (
        <Box>
          <Tabs defaultValue={socialIntegrations[0]}>
            <TabsList>
              {socialIntegrations.map((integration, index) => (
                <TabsTab key={index} value={integration}>
                  Youtube
                </TabsTab>
              ))}
            </TabsList>

            {children}
          </Tabs>
        </Box>
      )}
    </PageLayout>
  );
};

export default PostsPage;

{
  /* <TabsPanel value="gallery">Gallery tab content</TabsPanel>

<TabsPanel value="messages">Messages tab content</TabsPanel>

<TabsPanel value="settings">Settings tab content</TabsPanel> */
}
