import { IQueueRepository, IQueue, QueueStatus } from "./queues.interface";

export class QueueRepository implements IQueueRepository {
  constructor(private prisma: any) {}

  async create(queue: Partial<IQueue>): Promise<IQueue> {
    return this.prisma.queue.create({ data: queue });
  }

  async findById(id: number): Promise<IQueue | null> {
    return this.prisma.queue.findUnique({ where: { id } });
  }

  async findByStatus(status: QueueStatus): Promise<IQueue[]> {
    return this.prisma.queue.findMany({
      where: {
        status,
        isDead: false,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async update(id: number, data: Partial<IQueue>): Promise<IQueue> {
    return this.prisma.queue.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.queue.delete({ where: { id } });
  }

  async incrementAttempts(id: number): Promise<IQueue> {
    return this.prisma.queue.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });
  }
}
