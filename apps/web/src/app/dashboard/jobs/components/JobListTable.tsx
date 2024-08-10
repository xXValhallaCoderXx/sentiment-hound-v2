import { auth } from "@/lib/next-auth.lib";
import {
  Table,
  TableTr,
  TableThead,
  TableTh,
  TableTbody,
  TableTd,
  Flex,
} from "@mantine/core";
import NoData from "@/components/molecules/NoData";
import { taskRepository } from "services/src/task/task.repository";
import RestartSyncButton from "./RestartSyncButton";
import DeleteJobButton from "./DeleteJobSyncButton";

const JobListTable = async () => {
  const session = await auth();
  const userId = session?.user?.id as string;
  const jobs = await taskRepository.getUserTasks({ userId });

  if (jobs?.length === 0) {
    return (
      <Flex flex={1} justify="center" className="h-full">
        <NoData
          title="No Jobs Found"
          description="Create a job to get started"
          redirectCta={{
            href: "/dashboard/posts",
            label: "Sync Integration",
          }}
        />
      </Flex>
    );
  }

  const rows = jobs?.map((element) => {
    return (
      <TableTr key={element.id}>
        <TableTd>{element.syncs[0]?.provider?.name}</TableTd>
        <TableTd>{element.status}</TableTd>
        <TableTd>{new Date(element.createdAt).toDateString()}</TableTd>
        <TableTd>{new Date(element.updatedAt).toDateString()}</TableTd>
        <TableTd>
          <Flex gap={2}>
            <RestartSyncButton jobId={element.id} />
            <DeleteJobButton jobId={element.id} />
          </Flex>
        </TableTd>
      </TableTr>
    );
  });

  return (
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
  );
};

export default JobListTable;
