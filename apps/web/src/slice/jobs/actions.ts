"use server";
import { auth } from "@/lib/next-auth.lib";
import { revalidatePath } from "next/cache";
import { taskService } from "services/src/task/task.service";

export const restartJobAction = async (prevState: any, formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  try {
    const jobId = formData.get("jobId");
    console.log("JOB ID", jobId);

    return { message: "Job Has Entered Queue", success: true };
  } catch (error: any) {
    console.log("ACTION ERROR ", error);
    return {
      message: error?.message ?? "Error initializing sync",
      error: true,
    };
  }
};

export const deleteJobAction = async (prevState: any, formData: FormData) => {
  const session = await auth();
  const userId = session?.user?.id as string;

  try {
    const jobIdEntry = formData.get("jobId");

    // Ensure jobIdEntry is a string before converting to number
    if (!jobIdEntry || typeof jobIdEntry !== "string") {
      return {
        message: "Job ID is required and must be a string",
        error: true,
      };
    }
    const jobId = Number(jobIdEntry);
    const response = await taskService.deleteUserTask(jobId);

    return { message: response.message, success: true };
  } catch (error: any) {
    console.log("ACTION ERROR ", error);
    return {
      message: error?.message ?? "Error initializing sync",
      error: true,
    };
  }
};
