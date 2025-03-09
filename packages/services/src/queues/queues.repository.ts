import { BaseRepository } from "../common/base.repository";
import { Queue, QueueStatus } from "@repo/db";

export class QueueRepository extends BaseRepository<Queue, number> {
  constructor(prisma: any) {
    super(prisma, "queue");
  }

  async findByStatus(status: QueueStatus): Promise<Queue[]> {
    return this.prisma.queue.findMany({
      where: {
        status,
        isDead: false,
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async incrementAttempts(id: number): Promise<Queue> {
    return this.prisma.queue.update({
      where: { id },
      data: {
        attempts: { increment: 1 },
      },
    });
  }
}
