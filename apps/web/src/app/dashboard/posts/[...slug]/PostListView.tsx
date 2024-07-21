"use client";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Table,
  TableTd,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  Drawer,
} from "@mantine/core";
import PostDetailDrawer from "./components/PostDetailDrawer";

const PostListView = ({ data }: any) => {
  const router = useRouter();
  const params = useSearchParams();

  const onCloseDrawer = () => {
    router.push("/dashboard/posts/youtube");
  };

  return (
    <>
      <Drawer
        opened={Boolean(params.get("id")) || false}
        onClose={onCloseDrawer}
      >
        <PostDetailDrawer id={params.get("id") || ""} />
      </Drawer>
    </>
  );
};

export default PostListView;
