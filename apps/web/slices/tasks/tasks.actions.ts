"use server";
import { IAddTaskDto } from "./task.dto";

import { taskService } from "./task.service";
import { Task } from "@repo/db";

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
    const providerId = data.get("providerId");
    const taskType = data.get("taskType");

    console.log("PROVIDER ID ", providerId);
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to add task"
    );
  }
}