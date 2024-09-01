"use server";
import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { TaskType } from "database";
import {
  integrationsService,
  youtubeService,
  NotFoundError,
  taskService,
} from "services";

export const integrationMenuAction = async (
  prevState: any,
  formData: FormData
) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  const integrationType = formData.get("integrationName");
  const syncType = formData.get("syncType");

  const integration = await integrationsService.getUserIntegration({
    name: integrationType as string,
    userId,
  });

  if (!integration) {
    throw new NotFoundError("Integration not found");
  }

  const response = await taskService.createUserTask({
    userId,
    type: TaskType.FULL_SYNC,
    integrationId: integration.id,
  });
  console.log("ACTION  RESPONSE", response);

  return {
    message: "New Sync Created",
    error: false,
  };

  // try {
  //   const response = await syncService.fullSyncUserIntegration({
  //     userId,
  //     type: syncType as SyncType,
  //     name: integration as string,
  //   });
  //   console.log("ACTION RESPONSE", response);
  //   revalidatePath(`/dashboard/posts/${integration}`);
  //   return { message: "New Sync Created", success: true };
  // } catch (error: any) {
  //   console.log("ACTION ERROR ", error);
  //   return {
  //     message: error?.message,
  //     error: true,
  //   };
  // }
};
