import { prisma } from "@repo/db";
import { auth } from "@/lib/next-auth.lib";
import { Button, Stack, TextInput, Select, Group, Text } from "@mantine/core";
import { addNewKeyword, deleteKeyword } from "@/actions/keywords.actions";
import { revalidatePath } from "next/cache";

const IntegrationKeywords = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>You must be logged in to view this page</div>;
  }
  const userId = session.user.id;

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

  async function addKeywordAction(formData: FormData) {
    "use server";

    const keyword = formData.get("keyword") as string;
    const providerId = formData.get("providerId") as string;

    if (!keyword || !providerId) {
      console.error("Missing keyword or providerId");
      return;
    }

    try {
      const providerIdNum = parseInt(providerId, 10);
      if (isNaN(providerIdNum)) {
        console.error("Invalid providerId");
        return;
      }
      await addNewKeyword({
        integration: { userId, providerId: providerIdNum },
        value: keyword,
      });
      revalidatePath("/dashboard/integrations");
    } catch (error) {
      console.error("Failed to add keyword:", error);
    }
  }

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

      await deleteKeyword({ keywordId: keywordIdNum, userId });
    } catch (error) {
      console.error(
        "Error occurred during keyword deletion (from component):",
        error
      );
    }
  }

  return (
    <Stack>
      <form action={addKeywordAction}>
        <Group>
          <Select
            name="providerId"
            placeholder="Select provider"
            data={integrations.map((integration) => ({
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
        <Stack gap="xs">
          {keywords.map((keyword) => (
            <Group key={keyword.id} justify="space-between">
              <Text>
                <strong>{keyword.keyword}</strong> - {keyword.provider.name}
              </Text>
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
