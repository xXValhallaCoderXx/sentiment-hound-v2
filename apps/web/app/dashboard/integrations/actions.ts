"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// import { auth } from "@/lib/next-auth.lib";
// import { providersService, integrationsService } from "services";

export const revokeOauthAction = async () => {
  // const session = await auth();
  // const userId = session?.user?.id;
  // if (!userId) {
  //   throw new Error("User not found");
  // }

  // if (!formData.get("providerId")) {
  //   throw new Error("Provider not found");
  // }
  // const rawFormData = {
  //   providerId: formData.get("providerId"),
  // };

  // const provider = await providersService.getProviderById(
  //   rawFormData.providerId as string
  // );

  // const userIntegrations = await integrationsService.getUserIntegrations(
  //   userId as string
  // );

  // const integration = userIntegrations.find(
  //   (integration) =>
  //     String(integration.providerId) === String(rawFormData.providerId)
  // );

  // if (integration?.accessToken) {
  //   await revokeToken(integration.accessToken);
  // }

  // if (integration?.refreshToken) {
  //   await revokeToken(integration.refreshToken);
  // }

  // await integrationsService.deleteUserIntegration(
  //   userId as string,
  //   rawFormData.providerId as string
  // );

  revalidatePath("/dashboard/jobs");
  redirect("/dashboard/integrations");
};
