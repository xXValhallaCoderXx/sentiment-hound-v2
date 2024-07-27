"use server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { SyncType } from "database";
import { integrationsService, youtubeService, syncService } from "services";

export const integrationMenuAction = async (formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  const integration = formData.get("integrationName");
  const syncType = formData.get("syncType");
  console.log("INTEGRATION", integration);
  console.log("SYNC TYPE", syncType);
  console.log("USER ID", userId);

  try {
    const response = await syncService.fullSyncUserIntegration({
      userId,
      type: syncType as SyncType,
      name: integration as string,
    });
  } catch (error) {
    console.log("ERROR", error);
  }

  redirect(`/dashboard/posts/youtube?isSyncStarted=true`);
};
