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
  } catch (error) {
    console.log("ERRORO ", error);
    if (error instanceof NotFoundError) {
      // redirect(`/dashboard/posts/youtube?isSyncStarted=false`);
      return { message: "what" };
    } else {
      // redirect(`/dashboard/posts/youtube?isSyncError=true`);
      return { message: "what" };
    }
  }

  redirect(`/dashboard/posts/youtube?isSyncStarted=true`);
};
