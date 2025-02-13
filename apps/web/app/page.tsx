import { prisma } from "@repo/db";

export default async function Home() {
  const x = await prisma.user.findMany();
  console.log("USERS: ", x);
  return <div>dsds</div>;
}
