"use server";
// import { auth } from "@/lib/next-auth.lib";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
// import { TaskType } from "database";
// import {
//   integrationsService,
//   youtubeService,
//   NotFoundError,
//   taskService,
//   isCustomError,
//   ResourceCreateError,
// } from "services";

// Define the state type
export interface IFormState {
  status: "idle" | "success" | "error";
  message: string;
  data?: {
    taskId?: number;
    integrationId?: string;
  };
}

export const integrationMenuAction = async (
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  try {
    // Authenticate user
    // const session = await auth();
    const session: any = {};
    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const userId = session?.user?.id as string;

    // Extract and validate form data
    const integrationType = formData.get("integrationName");
    const syncType = formData.get("syncType");

    if (!integrationType) {
      return {
        status: "error",
        message: "Integration name is required",
      };
    }

    // Get integration
    // const integration = await integrationsService.getUserIntegration({
    //   name: integrationType as string,
    //   userId,
    // });

    // if (!integration) {
    //   return {
    //     status: "error",
    //     message: "Integration not found",
    //   };
    // }

    // Create task
    // const task = await taskService.createUserTask({
    //   userId,
    //   type: TaskType.FULL_SYNC,
    //   integrationId: integration.id,
    // });

    // Start task
    // await taskService.startUserTask({
    //   taskId: task.id,
    //   userId,
    // });

    // Optionally revalidate the path if needed
    // revalidatePath("/dashboard/posts");

    return {
      status: "success",
      message: "Sync task created and started successfully",
      data: {
        // taskId: task.id,
        taskId: 1,
        // integrationId: String(integration.id),
        integrationId: "1",
      },
    };
  } catch (error) {
    // Handle specific errors
    console.error("Integration menu action error:", error);

    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

export const fetchIntegerationContent = async (
  prevState: IFormState,
  formData: FormData
): Promise<IFormState> => {
  try {
    // Authenticate user
    // const session = await auth();
    const session: any = {};
    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized access",
      };
    }

    const userId = session?.user?.id as string;

    // Extract and validate form data
    const integrationType = formData.get("integrationName");
    const syncType = formData.get("syncType");

    if (!integrationType) {
      return {
        status: "error",
        message: "Integration name is required",
      };
    }

    // Get integration
    // const integration = await integrationsService.getUserIntegration({
    //   name: integrationType as string,
    //   userId,
    // });

    // if (!integration) {
    //   return {
    //     status: "error",
    //     message: "Integration not found",
    //   };
    // }

    // Create task
    // const task = await taskService.createUserTask({
    //   userId,
    //   type: TaskType.FETCH_CONTENT,
    //   integrationId: integration.id,
    // });

    // // Start task
    // await taskService.startUserTask({
    //   taskId: task.id,
    //   userId,
    // });

    // Optionally revalidate the path if needed
    // revalidatePath("/dashboard/posts");

    return {
      status: "success",
      message: "Fetch content task added to queue",
      data: {
        taskId: 11,
        // integrationId: String(integration.id),
        integrationId: "1",
      },
    };
  } catch (error) {
    return {
      status: "error",
      // message: isCustomError(error)
      //   ? error.friendlyMessage
      //   : "An unexpected error occurred",
      message: "ss",
    };
  }
};
