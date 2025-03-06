import { redirect } from "next/navigation";

import { auth } from "@/lib/next-auth.lib";

const PostsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;

  redirect(`/dashboard/posts/youtube`);
};

export default PostsPage;
