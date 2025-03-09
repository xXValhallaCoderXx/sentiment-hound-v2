import PageLayout from "@/components/templates/PageLayout";
// import { integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import Link from "next/link";
import NoData from "@/components/molecules/NoData";
import { Suspense } from "react";
import LoadingList from "./components/LoadingList";
import {
  Box,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  Text,
  Flex,
  Button,
} from "@mantine/core";

import { CoreProviderService } from "@repo/services";
import { IntegrationRepository, ProviderRepository } from "@repo/services";

import { prisma } from "@repo/db";

const providerRepository = new ProviderRepository(prisma);
const providerService = new CoreProviderService(providerRepository);

const PostsPage = async ({ children }: any) => {
  const session = await auth();

  const providers = await providerService.getAllProviders();

  return (
    <PageLayout title="Posts">
      <Box>
        <Flex justify="space-between" align="center">
          <Text size="sm">
            Select from the list below of your content posts, you can choose
            which posts to anayse or even blacklist.
          </Text>
          <Flex>
            <Button>Fetch Posts</Button>
          </Flex>
        </Flex>

        <Suspense fallback={<LoadingList />}>
          <Tabs className="mt-4 h-full" defaultValue={providers[0]?.name}>
            <TabsList>
              {providers.map((provider, index) => (
                <TabsTab
                  className="capitalize"
                  key={index}
                  component={Link}
                  // @ts-ignore
                  href={`/dashboard/posts/${provider.name}`}
                  value={provider.name}
                >
                  {provider.name}
                </TabsTab>
              ))}
            </TabsList>
            <TabsPanel value={providers[0]?.name || ""}>{children}</TabsPanel>
          </Tabs>
        </Suspense>
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
