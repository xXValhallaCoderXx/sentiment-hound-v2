import { redirect } from "next/navigation";
import { integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";

const PostsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);

  const socialIntegrations = integrations.map(
    (integration) => integration.provider.name
  );
  console.log("MISSING INTEGRATION PAGE");
  redirect(`/dashboard/posts/${socialIntegrations[0]}`);
};

export default PostsPage;
