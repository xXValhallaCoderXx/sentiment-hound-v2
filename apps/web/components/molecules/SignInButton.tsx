import { Button } from "@mantine/core";
import { handleGoogleSignIn } from "@/actions/auth.actions";

export function SignInButton() {
  return (
    <form action={handleGoogleSignIn}>
      <Button variant="filled" type="submit">
        Sign in
      </Button>
    </form>
  );
}
