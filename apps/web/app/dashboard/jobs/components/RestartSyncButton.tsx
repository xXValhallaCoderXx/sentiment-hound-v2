"use client";

import { FC } from "react"; // Removed useEffect, useRef
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom"; // Removed useFormState
// import { restartJobAction } from "@/slice/jobs/actions";
// import { notifications } from "@mantine/notifications"; // Unused
interface ISyncSubmitButtonProps {
  jobId: number;
}

// const initialState = { // Unused
//   message: "",
//   error: false,
// };

const RestartSyncButton: FC<ISyncSubmitButtonProps> = ({ jobId }) => {
  // const [state, formAction] = useFormState(restartJobAction, initialState);

  // useEffect(() => {
  //   if (state.error) {
  //     notifications.show({
  //       color: "red",
  //       title: "Error initializng sync",
  //       message: state?.message,
  //     });
  //   } else if (state.success) {
  //     notifications.show({
  //       color: "green",
  //       title: "Sync created",
  //       message: state?.message,
  //     });
  //   }
  // }, [state]);
  return (
    <form>
      <SubmitButton />
      <input type="hidden" name="jobId" value={jobId} />
      <input type="hidden" name="syncType" value="full" />
    </form>
  );
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      color="blue"
      fullWidth
      loading={pending}
    >
      Restart Job
    </Button>
  );
}

export default RestartSyncButton;
