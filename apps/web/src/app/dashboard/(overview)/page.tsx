import { StatsCards, ListSearch } from "./components";
import { postService } from "services";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const posts = await postService.getPosts({ page: 1, limit: 10 });

  return (
    <div className="h-full px-4 py-4">
      <StatsCards />
      ssssss
      <div className="mt-4">
        <ListSearch placeholder="Search me" />
      </div>
    </div>
  );
};

export default DashboardPage;
