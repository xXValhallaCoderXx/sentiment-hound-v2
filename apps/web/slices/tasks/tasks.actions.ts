"use server";

import { taskService } from "./task.service";
import { ITask } from "@repo/services";

export async function getTask(id: string): Promise<ITask> {
  try {
    return await taskService.getTask(id);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch task"
    );
  }
}
