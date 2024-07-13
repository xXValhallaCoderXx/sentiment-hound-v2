import { redirect } from "next/navigation";
import { integrationsService } from "services";
import { auth } from "@/lib/next-auth.lib";

const PostsPage = async (props: any) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const integrations = await integrationsService.getUserIntegrations(userId);

  const socialIntegrations = integrations.map(
    (integration) => integration.provider.name
  );
  if (Object.keys(props.searchParams).length === 0) {
    redirect(`/dashboard/posts/${socialIntegrations[0]}`);
  }

  return null;
};

export default PostsPage;
