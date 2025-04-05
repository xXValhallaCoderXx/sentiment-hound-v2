import { auth } from "@/lib/next-auth.lib";
import PageLayout from "@/components/templates/PageLayout";
import Link from "next/link";
import {
  Avatar,
  Card,
  Flex,
  Box,
  Text,
  Title,
  Stack,
  Notification,
} from "@mantine/core";
import ProfileCard from "./components/ProfileCard";
// import { userService, planService } from "services";
import Plans from "./components/Plans";

const ProfilePage = async (props: any) => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <PageLayout title="Profile" description="User profile page">
      <Stack gap={16}>
        <Flex gap={16}>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title order={4}>Plan</Title>
              <ProfileCard id={String(userId)} />
            </Card>
          </Flex>
          <Flex w="33%">
            <Card withBorder w="100%">
              <Title order={4}>Billing and Payment</Title>
            </Card>
          </Flex>
        </Flex>
      </Stack>
      <Box mt={24}>
        <Title order={3}>Subscription Details</Title>
        <Plans />
      </Box>
      {/* {props?.searchParams?.planUpdated === "true" && (
        <Box pos="absolute" right={60} top={60}>
          <Link href="/dashboard/profile">
            <Notification
              icon={<CheckCircle />}
              color="teal"
              title="Plan updated!"
              mt="md"
            >
              You have successfully updated your plan
            </Notification>
          </Link>
        </Box>
      )}

  

       */}
    </PageLayout>
  );
};

export default ProfilePage;
