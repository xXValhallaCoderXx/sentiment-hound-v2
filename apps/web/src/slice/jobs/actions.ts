"use server";
import { auth } from "@/lib/next-auth.lib";

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
    const jobId = formData.get("jobId");
    console.log("JOB ID", jobId);

    return { message: "Job Deleted", success: true };
  } catch (error: any) {
    console.log("ACTION ERROR ", error);
    return {
      message: error?.message ?? "Error initializing sync",
      error: true,
    };
  }
};
