import {
  Box,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTd,
  TableTbody,
  Skeleton,
} from "@mantine/core";

export default function JobListTableLoading() {
  return (
    <Box>
      <Table withBorder>
        <TableThead>
          <TableTr>
            <TableTh></TableTh>
            <TableTh>ID</TableTh>
            <TableTh>Type</TableTh>
            <TableTh>Integration</TableTh>
            <TableTh>Status</TableTh>
            <TableTh>Progress</TableTh>
            <TableTh>Created</TableTh>
            <TableTh>Updated</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <TableTr key={i}>
                <TableTd>
                  <Skeleton height={24} circle />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={40} />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={100} />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={80} />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={80} />
                </TableTd>
                <TableTd>
                  <Skeleton height={40} />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={120} />
                </TableTd>
                <TableTd>
                  <Skeleton height={24} width={120} />
                </TableTd>
              </TableTr>
            ))}
        </TableTbody>
      </Table>
    </Box>
  );
}
