"use client";

import { FC } from "react";
import { Button } from "@mantine/core";
import { useFormStatus } from "react-dom";
// import { deleteJobAction } from "@/slice/jobs/actions";

interface IDeleteJobButton {
  jobId: number;
}

const DeleteJobButton: FC<IDeleteJobButton> = ({ jobId }) => {
  // const [state, formAction] = useFormState(deleteJobAction, initialState);

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
  //       title: "Job Deleted",
  //       message: state?.message,
  //     });
  //   }
  // }, [state]);
  return (
    // <form action={formAction}>
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
      color="red"
      fullWidth
      loading={pending}
    >
      Delete Job
    </Button>
  );
}

export default DeleteJobButton;
