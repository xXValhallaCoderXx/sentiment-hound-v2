import { Button } from "@/components/ui/button";
import { userService } from "services";

const DashboardPage = async () => {
  const users = await userService.getUsers();
  console.log("users", users);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button>DASHBOARD</Button>
    </main>
  );
};

export default DashboardPage;
