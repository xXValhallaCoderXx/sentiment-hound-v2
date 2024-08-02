import { auth } from "@/lib/next-auth.lib";
import PageLayout from "@/components/templates/PageLayout";
import {
  Table,
  TableTr,
  TableThead,
  TableTh,
  TableTbody,
  TableTd,
} from "@mantine/core";

import { taskRepository } from "services/src/task/task.repository";

const JobsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const jobs = await taskRepository.getUserTasks({ userId });
  console.log("JOBS", jobs);

  const rows = jobs?.map((element) => (
    <TableTr key={element.id}>
      <TableTd>{element.type}</TableTd>
      <TableTd>{element.status}</TableTd>
      <TableTd>{new Date(element.createdAt).toDateString()}</TableTd>
      <TableTd>{new Date(element.updatedAt).toDateString()}</TableTd>
      <TableTd>Hello</TableTd>
    </TableTr>
  ));

  return (
    <PageLayout title="Jobs" description="Check you latests jobs">
      Jobs Page
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Type</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>Created At</TableTh>
            <TableTh>Updated At</TableTh>
            <TableTh>Actions</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{rows}</TableTbody>
      </Table>
    </PageLayout>
  );
};

export default JobsPage;
