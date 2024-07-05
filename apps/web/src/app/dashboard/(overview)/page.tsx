import { StatsCards } from "./components";
import { postService } from "services";

const DashboardPage = async () => {
  const posts = await postService.getPosts({ page: 1, limit: 10 });
  console.log(posts);
  return (
    <div className="h-full px-4 py-4">
      <StatsCards />
    </div>
  );
};

export default DashboardPage;
