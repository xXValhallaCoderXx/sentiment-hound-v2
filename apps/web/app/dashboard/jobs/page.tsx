// import { auth } from "@/lib/next-auth.lib";
import { Suspense } from "react";
import JobListTable from "./components/JobListTable";
import JobListTableLoading from "./components/JobListTableLoading";
// import PageLayout from "@/components/templates/PageLayout";
import { Flex } from "@mantine/core";
// import NoData from "@/components/molecules/NoData";
// import { integrationsService } from "services";

const JobsPage = async () => {
  // const session = await auth();
  // const userId = session?.user?.id as string;
  // const integrations = await integrationsService.getUserIntegrations(userId);

  // if (integrations.length === 0) {
  //   return (
  //     <PageLayout title="Jobs">
  //       <Flex flex={1} justify="center" className="h-full">
  //         <NoData
  //           title="No Integrations Found"
  //           description="Integrate a social media account to get started"
  //           redirectCta={{
  //             href: "/dashboard/integrations",
  //             label: "Integrate Account",
  //           }}
  //         />
  //       </Flex>
  //     </PageLayout>
  //   );
  // }
  return <div>sfd</div>;

  // return (
  //   <PageLayout title="Jobs" description="Check you latests jobs">
  //     Jobs Page
  //     <Suspense fallback={<JobListTableLoading />}>
  //       <JobListTable />
  //     </Suspense>
  //   </PageLayout>
  // );
};

export default JobsPage;
