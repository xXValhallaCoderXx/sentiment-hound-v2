"use client";
import {
  Table,
  TableTd,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  Flex,
  Text,
  Title,
} from "@mantine/core";
import { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface IPostListTableProps {
  data: any[];
}

const PostListTable: FC<IPostListTableProps> = ({ data }) => {
  const router = useRouter();
  const onClickRow = (_id: any) => () => {
    router.push(`/dashboard/posts/youtube?id=${_id}`);
  };

  const rows = data.map((element: any) => (
    <TableTr onClick={onClickRow(element?.id)} key={element.id}>
      <TableTd>{element.title}</TableTd>
      <TableTd>{element.publishedAt}</TableTd>
    </TableTr>
  ));

  if (data.length === 0) {
    return (
      <Flex
        className="mt-14"
        direction="column"
        justify="center"
        align="center"
      >
        <Image
          src="/images/page-content/no-data.png"
          width={650}
          height={650}
          alt="no-data"
        />
        <Title order={4}>You have no post data</Title>
        <Text size="sm">Please sync your account to view your posts</Text>
      </Flex>
    );
  }

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>Title</TableTh>
          <TableTh>Published At</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
};

export default PostListTable;
