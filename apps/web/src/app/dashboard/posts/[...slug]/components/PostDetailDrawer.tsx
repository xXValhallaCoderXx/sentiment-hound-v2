"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";
import { Drawer } from "@mantine/core";
interface IPostDetailDrawerProps {
  id: string;
}

const PostDetailDrawer: FC<IPostDetailDrawerProps> = ({ id }) => {
  const router = useRouter();
  if (!id) return null;
  console.log("PostDetailDrawer", id);

  const onClose = () => {
    router.push("/dashboard/posts/youtube");
  };
  return (
    <Drawer opened={Boolean(id)} closeOnClickOutside={false} onClose={onClose}>
      <div>dasda</div>
    </Drawer>
  );
};

export default PostDetailDrawer;
