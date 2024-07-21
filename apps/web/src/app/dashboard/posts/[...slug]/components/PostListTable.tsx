"use client";
import {
  Table,
  TableTd,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
} from "@mantine/core";
import { FC } from "react";
import { useRouter } from "next/navigation";

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
