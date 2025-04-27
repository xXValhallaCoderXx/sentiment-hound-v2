import { prisma } from "@repo/db";
import { auth } from "@/lib/next-auth.lib";
import { Button, Flex, Stack } from "@mantine/core";

const IntegrationKeywords = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>You must be logged in to view this page</div>;
  }
  const userId = session.user.id;
  const keywords = await prisma.trackedKeyword.findMany({
    where: {
      userId,
    },
    include: {
      provider: true,
      Mention: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Stack>
      <Flex justify="flex-end">
        <Button variant="outline" color="blue">
          Add Keyword
        </Button>
      </Flex>

      <div>
        <ul>
          {keywords.map((keyword) => (
            <li key={keyword.id}>
              <strong>{keyword.keyword}</strong> - {keyword.provider.name}
              <ul>
                {keyword.Mention.map((mention) => (
                  <li key={mention.id}>{mention.id}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Stack>
  );
};

export default IntegrationKeywords;
