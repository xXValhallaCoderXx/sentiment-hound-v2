import PageLayout from "@/components/templates/PageLayout";
import { integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";
import NoData from "@/components/molecules/NoData";
import { Suspense } from "react";
import LoadingList from "./components/LoadingList";
import { Box, Tabs, TabsList, TabsTab, Flex, Text } from "@mantine/core";

const PostsPage = async ({ children }: any) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);

  const socialIntegrations = integrations.map(
    (integration) => integration.provider.name
  );

  if (integrations.length === 0) {
    return (
      <PageLayout title="Posts">
        <Flex flex={1} justify="center" className="h-full">
          <NoData
            title="No Integrations Found"
            description="Please integrate a social media account"
            redirectCta={{
              href: "/dashboard/integrations",
              label: "Integrate Account",
            }}
          />
        </Flex>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Posts">
      <Box>
        <Text size="sm">
          Select from the list below of your content posts, you can choose which
          posts to anayse or even blacklist.
        </Text>
        <Tabs className="mt-4 h-full" defaultValue={socialIntegrations[0]}>
          <TabsList>
            {socialIntegrations.map((integration, index) => (
              <TabsTab className="capitalize" key={index} value={integration}>
                {integration}
              </TabsTab>
            ))}
          </TabsList>

          <Suspense fallback={<LoadingList />}>{children}</Suspense>
        </Tabs>
      </Box>
    </PageLayout>
  );
};

export default PostsPage;

{
  /* <TabsPanel value="gallery">Gallery tab content</TabsPanel>

<TabsPanel value="messages">Messages tab content</TabsPanel>

<TabsPanel value="settings">Settings tab content</TabsPanel> */
}
