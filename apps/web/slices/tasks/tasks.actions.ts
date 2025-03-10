"use server";

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
