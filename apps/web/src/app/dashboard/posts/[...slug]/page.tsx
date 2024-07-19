import { redirect } from "next/navigation";
import PageLayout from "@/components/templates/PageLayout";
import { integrationsService, youtubeService } from "services";
import { auth } from "@/lib/next-auth.lib";
import NoData from "@/components/molecules/NoData";
import {
  Box,
  Table,
  TableTd,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
} from "@mantine/core";

const PostListPage = async ({ params }: { params: { slug: string } }) => {
  const session = await auth();
  const youtubePosts = await youtubeService.fetchYoutubePosts(
    session?.user?.id as string
  );


  const rows = youtubePosts.map((element: any) => (
    <TableTr key={element.id}>
      <TableTd>{element.title}</TableTd>
      <TableTd>{element.publishedAt}</TableTd>
      {/* <Table.Td>{element.thumbnail}</Table.Td> */}
    </TableTr>
  ));

  return (
    <Box>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Title</TableTh>
            <TableTh>Published At</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </Box>
  );
};

export default PostListPage;
