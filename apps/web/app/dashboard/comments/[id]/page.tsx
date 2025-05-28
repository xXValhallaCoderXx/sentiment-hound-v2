import { Box, Text, Title } from "@mantine/core";
import { commentsService } from "@repo/services";

const CommentDetailsPage = async ({ params }: { params: { id: string } }) => {
  const commentId = parseInt(params.id);

  try {
    const comment = await commentsService.getComment(commentId);

    return (
      <Box p="xl">
        <Title order={3}>Comment Details</Title>
        <Text size="sm">Content: {comment.content}</Text>
        <Text size="sm">Sentiment: {comment.sentiment}</Text>
        <Text size="sm">Provider: {comment.provider}</Text>
        <Text size="sm">Aspects:</Text>
        {comment.aspects.map((aspect, index) => (
          <Text key={index} size="sm">
            - {aspect.aspect} ({aspect.sentiment})
          </Text>
        ))}
      </Box>
    );
  } catch (error) {
    console.error("Error fetching comment details:", error);
    return (
      <Box p="xl" ta="center">
        <Text color="red">An error occurred while loading comment details</Text>
      </Box>
    );
  }
};

export default CommentDetailsPage;
