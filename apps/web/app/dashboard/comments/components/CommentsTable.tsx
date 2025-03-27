import React from "react";
import {
  Box,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  Badge,
  Tooltip,
  Text,
} from "@mantine/core";

interface Comment {
  id: number;
  content: string;
  sentiment: string | null;
  provider: string;
  aspects: Array<{ aspect: string; sentiment: string }>;
}

interface CommentsTableProps {
  data: Comment[];
}

const CommentsTable: React.FC<CommentsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box p="md">
        <Text>No comments available. Try fetching new comments.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Table striped highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>Content</TableTh>
            <TableTh>Sentiment</TableTh>
            <TableTh>Provider</TableTh>
            <TableTh>Aspects</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {data.map((comment) => (
            <TableTr key={comment.id}>
              <TableTd>
                <Text size="sm">{comment.content}</Text>
              </TableTd>
              <TableTd>
                {comment.sentiment ? (
                  <Badge
                    color={
                      comment.sentiment === "POSITIVE"
                        ? "green"
                        : comment.sentiment === "NEGATIVE"
                          ? "red"
                          : "gray"
                    }
                  >
                    {comment.sentiment}
                  </Badge>
                ) : (
                  <Text size="sm" color="dimmed">
                    N/A
                  </Text>
                )}
              </TableTd>
              <TableTd>
                <Text size="sm">{comment.provider}</Text>
              </TableTd>
              <TableTd>
                {comment.aspects.length > 0 ? (
                  comment.aspects.map((aspect, index) => (
                    <Tooltip
                      key={index}
                      label={`Sentiment: ${aspect.sentiment}`}
                      withArrow
                    >
                      <Badge
                        color={
                          aspect.sentiment === "positive"
                            ? "green"
                            : aspect.sentiment === "negative"
                              ? "red"
                              : "gray"
                        }
                        variant="light"
                        size="sm"
                        mr="xs"
                      >
                        {aspect.aspect}
                      </Badge>
                    </Tooltip>
                  ))
                ) : (
                  <Text size="sm" color="dimmed">
                    No aspects
                  </Text>
                )}
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
    </Box>
  );
};

export default CommentsTable;
