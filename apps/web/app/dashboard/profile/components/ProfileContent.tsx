"use client";

import React from "react";
import { Stack, Title, Text } from "@mantine/core";
import PlanUsageCard from "@/components/organisms/PlanUsageCard/PlanUsageCard";
import AccountManagementCard from "@/components/organisms/AccountManagementCard/AccountManagementCard";
import DeleteAccountModal from "@/components/molecules/DeleteAccountModal/DeleteAccountModal";
import { deleteAccount } from "@/actions/account.actions";
import { useDisclosure } from "@mantine/hooks";
import { PlanData, TokenUsage } from "@/types";

interface ProfileContentProps {
  planData?: PlanData;
  tokenUsage?: TokenUsage;
  userEmail?: string;
  userId?: string;
  userCreatedAt?: Date;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  planData,
  tokenUsage,
  userEmail,
  userId,
  userCreatedAt,
}) => {
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDeleteAccountRequest = () => {
    openDeleteModal();
  };

  const handleDeleteAccountConfirm = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAccount();
      if (result.error) {
        console.error("Delete account error:", result.error);
        // TODO: Show error notification
      } else {
        // Navigation will be handled by the auth system after deletion
      }
    } catch (error) {
      console.error("Delete account error:", error);
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  return (
    <>
      {/* Page Header */}
      <Stack gap="xs" mb="xl">
        <Title order={1} fw={700}>
          Settings
        </Title>
        <Text c="dimmed" size="md">
          Manage your plan, usage, and account settings
        </Text>
      </Stack>

      <Stack gap="xl">
        {/* Plan & Usage Card */}
        <PlanUsageCard
          planData={planData}
          tokenUsage={tokenUsage}
          isLoading={false}
          hasError={false}
          showDetails={true}
        />

        {/* Account Management Card */}
        <AccountManagementCard
          onDeleteAccount={handleDeleteAccountRequest}
          isLoading={isDeleting}
          disabled={false}
          userEmail={userEmail}
          userId={userId}
          userCreatedAt={userCreatedAt}
        />
      </Stack>

      {/* Delete Account Confirmation Modal */}
      <DeleteAccountModal
        opened={deleteModalOpened}
        onConfirm={handleDeleteAccountConfirm}
        onCancel={closeDeleteModal}
        isLoading={isDeleting}
      />
    </>
  );
};

export default ProfileContent;
