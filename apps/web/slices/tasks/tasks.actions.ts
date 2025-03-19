"use server";
import { IAddTaskDto } from "./task.dto";
import { auth } from "@/lib/next-auth.lib";

import { Task, TaskType } from "@repo/db";
import { queueService, taskService } from "@repo/services";

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
    const providerId = data.get("providerId") ?? "";
    const taskType = data.get("taskType") as TaskType;

    // For FULL_SYNC tasks on YouTube, extract additional data (e.g., youtubeChannelId)
    let extraData = {};
    if (taskType === TaskType.FULL_SYNC) {
      extraData = {
        youtubeChannelId: data.get("youtubeChannelId") as string,
      };
    }

    console.log("PROVIDER ID ", providerId);
    console.log("TASK TYPE ", taskType);
    console.log("USER ID ", userId);

    const newTask = await taskService.createTask({
      providerId,
      taskType,
      userId,
    });
    await queueService.enqueueTask(newTask.id, taskType, extraData);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to add task"
    );
  }
}