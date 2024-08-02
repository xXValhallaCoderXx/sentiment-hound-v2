"use server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  console.log("INTEGRATION TYPE", integration);
  console.log("SYNC TYPE", syncType);
  console.log("USER ID", userId);

  try {
    const response = await syncService.fullSyncUserIntegration({
      userId,
      type: syncType as SyncType,
      name: integration as string,
    });
    console.log("ACTION RESPONSE", response);
    revalidatePath(`/dashboard/posts/${integration}`);
    return { message: "New Sync Created", success: true };
  } catch (error: any) {
    console.log("ACTION ERROR ", error);
    return {
      message: error?.message,
      error: true,
    };
  }
};
