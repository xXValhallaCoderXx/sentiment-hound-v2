"use server";
import styles from "./page.module.css";
import { prisma } from "@repo/db";

const RootPage = async () => {
  const user = await prisma.user.findFirst();

  return <div className={styles.page}>ssss</div>;
};

export default RootPage;
