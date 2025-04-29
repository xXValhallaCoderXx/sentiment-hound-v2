import { prisma } from "@repo/db";
import { auth } from "@/lib/next-auth.lib";
import { Button, Stack, TextInput, Select, Group, Text } from "@mantine/core"; // Added Text to imports
import { addNewKeyword } from "@/actions/keywords.actions";
import { revalidatePath } from "next/cache";

const IntegrationKeywords = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>You must be logged in to view this page</div>;
  }
  const userId = session.user.id;

  // Fetch keywords and integrations in parallel
  const [keywords, integrations] = await Promise.all([
    prisma.trackedKeyword.findMany({
      where: { userId },
      include: { provider: true, mention: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.integration.findMany({
      where: { userId },
      include: { provider: true },
    }),
  ]);

  // Define the inline server action
  async function addKeywordAction(formData: FormData) {
    "use server";

    const keyword = formData.get("keyword") as string;
    const providerId = formData.get("providerId") as string;

    if (!keyword || !providerId) {
      console.error("Missing keyword or providerId");
      return;
    }

    try {
      // The action expects providerId as a number, but FormData gives string
      const providerIdNum = parseInt(providerId, 10);
      if (isNaN(providerIdNum)) {
        console.error("Invalid providerId");
        return;
      }
      await addNewKeyword({
        integration: { userId, providerId: providerIdNum }, // Pass numeric providerId
        value: keyword,
      });
      revalidatePath("/dashboard/integrations");
    } catch (error) {
      console.error("Failed to add keyword:", error);
    }
  }

  // Delete Keyword Server Action
  async function deleteKeywordAction(formData: FormData) {
    "use server";

    const keywordId = formData.get("keywordId") as string;

    if (!keywordId) {
      console.error("Missing keywordId");
      return;
    }

    try {
      const keywordIdNum = parseInt(keywordId, 10);
      if (isNaN(keywordIdNum)) {
        console.error("Invalid keywordId");
        return;
      }
      // Authorization check
      const keywordToDelete = await prisma.trackedKeyword.findUnique({
        where: { id: keywordIdNum },
        select: { userId: true },
      });

      if (keywordToDelete?.userId !== userId) {
        console.error("Unauthorized attempt to delete keyword");
        return;
      }

      await prisma.trackedKeyword.delete({
        where: { id: keywordIdNum },
      });
      revalidatePath("/dashboard/integrations");
    } catch (error) {
      console.error("Failed to delete keyword:", error);
      // Add user-facing error handling if desired
    }
  }

  return (
    <Stack>
      {/* Form to add a new keyword */}
      <form action={addKeywordAction}>
        <Group>
          <Select
            name="providerId"
            placeholder="Select provider"
            data={integrations.map((integration) => ({
              // Ensure value is a string for Mantine Select
              value: integration.providerId.toString(),
              label: integration.provider.name,
            }))}
            required
            clearable={false}
          />
          <TextInput name="keyword" placeholder="Enter keyword" required />
          <Button type="submit" variant="outline" color="blue">
            Add Keyword
          </Button>
        </Group>
      </form>

      <div>
        {/* Updated keyword list with delete buttons */}
        <Stack gap="xs">
          {" "}
          {/* Use Stack for vertical spacing */}
          {keywords.map((keyword) => (
            <Group key={keyword.id} justify="space-between">
              {" "}
              {/* Use Group for horizontal layout */}
              <Text>
                <strong>{keyword.keyword}</strong> - {keyword.provider.name}
              </Text>
              {/* Form for deleting this specific keyword */}
              <form action={deleteKeywordAction}>
                <input type="hidden" name="keywordId" value={keyword.id} />
                <Button type="submit" variant="outline" color="red" size="xs">
                  Delete
                </Button>
              </form>
            </Group>
          ))}
        </Stack>
      </div>
    </Stack>
  );
};

export default IntegrationKeywords;
