// import { trackedKeywordService } from "@repo/services";
import { prisma } from "@repo/db";
import { revalidatePath } from "next/cache";

// Define types for addNewKeyword arguments
interface AddKeywordIntegration {
  userId: string;
  providerId: number;
}

interface AddKeywordParams {
  integration: AddKeywordIntegration;
  value: string;
}

// Use defined types instead of any
export const addNewKeyword = ({ integration, value }: AddKeywordParams) => {
  // return trackedKeywordService.createKeyword({
  //   userId: integration.userId,
  //   providerId: integration.providerId,
  //   keyword: value,
  // });
};

// New deleteKeyword action
export const deleteKeyword = async ({
  keywordId,
  userId,
}: {
  keywordId: number;
  userId: string;
}) => {
  "use server";

  try {
    // Authorization check: Ensure the keyword belongs to the user
    const keywordToDelete = await prisma.trackedKeyword.findUnique({
      where: { id: keywordId },
      select: { userId: true },
    });

    if (!keywordToDelete) {
      throw new Error("Keyword not found.");
    }

    if (keywordToDelete.userId !== userId) {
      throw new Error("Unauthorized attempt to delete keyword.");
    }

    // Corrected call: Pass keywordId directly as a number
    // await trackedKeywordService.deleteKeyword(keywordId);

    // Revalidate the path after successful deletion
    revalidatePath("/dashboard/integrations");
  } catch (error) {
    console.error("Failed to delete keyword:", error);
    // Rethrow or handle the error as needed for the UI
    // For now, just logging it. You might want to return an error status.
    throw error; // Rethrowing allows the component to potentially catch it
  }
};
