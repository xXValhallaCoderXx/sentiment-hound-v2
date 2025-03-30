"use server";

import { auth } from "@/lib/next-auth.lib";

import { TaskType } from "@repo/db";
import { taskService } from "@repo/services";

export async function getTask(id: string): Promise<string> {
  try {
    // return await taskService.getTask(id);
    return "";
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch task"
    );
  }
}

export async function addNewTask(data: FormData): Promise<void> {
  try {
    const session = await auth();
    const userId = session?.user?.id as string;
    const integrationId = data.get("integrationId") as string;
    const taskType = data.get("taskType") as TaskType;

    // Parse the extraData JSON that contains the URL
    let extraData = {};
    const extraDataString = data.get("extraData") as string;

    if (extraDataString) {
      try {
        extraData = JSON.parse(extraDataString);
      } catch (e) {
        console.error("Error parsing extraData:", e);
      }
    }

    await taskService.createTask({
      integrationId: Number(integrationId),
      taskType,
      userId,
      extraData,
    });
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to add task"
    );
  }
}