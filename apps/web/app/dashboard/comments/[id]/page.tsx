import { Box, Text, Title } from "@mantine/core";
import { mentionService } from "@repo/services";

const CommentDetailsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { id } = await searchParams;
  const commentId = parseInt(String(id));

  try {
    const comment = await mentionService.getMention(commentId);

    return (
      <Box p="xl">
        <Title order={3}>Comment Details</Title>
        <Text size="sm">Content: {comment.content}</Text>
        <Text size="sm">Sentiment: {comment.sentiment}</Text>
        {/* <Text size="sm">Provider: {comment.provider}</Text> */}
        <Text size="sm">Aspects:</Text>
        {/* {comment.aspects.map((aspect, index) => (
          <Text key={index} size="sm">
            - {aspect.aspect} ({aspect.sentiment})
          </Text>
        ))} */}
      </Box>
    );
  } catch (error) {
    console.error("Error fetching comment details:", error);
    return (
      <Box p="xl" ta="center">
        <Text c="error">An error occurred while loading comment details</Text>
      </Box>
    );
  }
};

export default CommentDetailsPage;
