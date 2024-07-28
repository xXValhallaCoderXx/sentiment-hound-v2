"use server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { SyncType } from "database";
import {
  integrationsService,
  youtubeService,
  syncService,
  NotFoundError,
} from "services";

export const integrationMenuAction = async (
  prevState: any,
  formData: FormData
) => {
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
    console.log("RESPONSE", response);
  } catch (error: any) {
    console.log("ERRORO ", error);
    if (error instanceof NotFoundError) {
      return {
        message: error?.message,
        error: true,
      };
    } else {
      return {
        message: error?.message,
        error: true,
      };
    }
  }

  // redirect(`/dashboard/posts/youtube?isSyncStarted=true`);
  return { message: "what", error: false };
};
