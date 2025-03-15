import PageLayout from "@/components/templates/PageLayout";
import Link from "next/link";
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
import { providerService } from "@repo/services";

const PostsPage = async ({ children }: any) => {
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
                <Link
                  href={`/dashboard/posts/${provider.name}`}
                  key={index}
                  passHref
                >
                  <TabsTab className="capitalize" value={provider.name}>
                    {provider.name}
                  </TabsTab>
                </Link>
              ))}
            </TabsList>
            {children}
          </Tabs>
        </Suspense>
      </Box>
    </PageLayout>
  );
};

export default PostsPage;
