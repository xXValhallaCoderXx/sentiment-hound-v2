import PageLayout from "@/components/templates/PageLayout";
import { integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";
import NoData from "@/components/molecules/NoData";

const PostsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);
  console.log("Integrations", integrations);
  return (
    <PageLayout title="Posts">
      {integrations.length === 0 ? (
        <NoData
          title="No Integrations Found"
          description="Please integrate a social media account"
        />
      ) : (
        <div>Posts Data</div>
      )}
    </PageLayout>
  );
};

export default PostsPage;
