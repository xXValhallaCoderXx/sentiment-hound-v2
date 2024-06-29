import { Button } from "@/components/ui/button";
import { userService } from "services";
import { signOut } from "@/lib/next-auth.lib";

const DashboardPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <Button type="submit">Sign out</Button>
      </form>
    </main>
  );
};

export default DashboardPage;
