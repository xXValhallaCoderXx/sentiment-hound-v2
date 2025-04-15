import { Task, PrismaClient, Prisma } from "@repo/db";

export class TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async create(args: Prisma.TaskCreateArgs): Promise<Task> {
    return this.prisma.task.create(args);
  }

  async createMany(args: Prisma.TaskCreateManyArgs) {
    return this.prisma.task.createMany(args);
  }

  async findAll(args?: Prisma.TaskFindManyArgs): Promise<Task[]> {
    return this.prisma.task.findMany(args || {});
  }

  async findById(
    id: string | number,
    args?: Omit<Prisma.TaskFindUniqueArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.task.findUnique({
      where: { id: idNumber },
      ...args,
    });
  }

  async findUnique(
    where: Prisma.TaskWhereUniqueInput,
    args?: Omit<Prisma.TaskFindUniqueArgs, "where">
  ) {
    return this.prisma.task.findUnique({
      where,
      ...args,
    });
  }

  async findFirst(
    where: Prisma.TaskWhereInput,
    args?: Omit<Prisma.TaskFindFirstArgs, "where">
  ) {
    return this.prisma.task.findFirst({
      where,
      ...args,
    });
  }

  async findMany(args: Prisma.TaskFindManyArgs) {
    return this.prisma.task.findMany(args);
  }

  async update(
    id: string | number,
    data: Prisma.TaskUpdateInput,
    args?: Omit<Prisma.TaskUpdateArgs, "where" | "data">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.task.update({
      where: { id: idNumber },
      data,
      ...args,
    });
  }

  async delete(
    id: string | number,
    args?: Omit<Prisma.TaskDeleteArgs, "where">
  ) {
    const idNumber = typeof id === "string" ? parseInt(id) : id;
    return this.prisma.task.delete({
      where: { id: idNumber },
      ...args,
    });
  }

  async count(
    where: Prisma.TaskWhereInput,
    args?: Omit<Prisma.TaskCountArgs, "where">
  ) {
    return this.prisma.task.count({
      where,
      ...args,
    });
  }
}
