"use client";

import { Drawer, Box, Text } from "@mantine/core";

import { useRouter } from "next/navigation";

interface CommentDrawerProps {
  opened: boolean;
  selectedComment: any;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  opened,
  selectedComment,
}) => {
  const router = useRouter();

  const handleClose = () => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("commentId");
    router.replace(currentUrl.toString());
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title="Comment Details"
      padding="lg"
      position="right"
    >
      {selectedComment ? (
        <Box>
          <Text size="sm">Content: {selectedComment.content}</Text>
          <Text size="sm">Sentiment: {selectedComment.sentiment}</Text>
          <Text size="sm">Provider: {selectedComment.provider}</Text>
          <Text size="sm">Aspects:</Text>
          {/* {selectedComment.aspects.map((aspect, index) => (
            <Text key={index} size="sm">
              - {aspect.aspect} ({aspect.sentiment})
            </Text>
          ))} */}
        </Box>
      ) : (
        <Text>Loading...</Text>
      )}
    </Drawer>
  );
};

export default CommentDrawer;
