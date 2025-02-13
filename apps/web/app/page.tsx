import { prisma } from "@repo/db";
import { Button } from "@mantine/core";

export default async function Home() {
  const x = await prisma.user.findMany();
  console.log("USERS: ", x);
  return (
    <div>
      <Button>asd</Button>
    </div>
  );
}
