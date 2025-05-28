import { BaseRepository } from "../common/base.repository";
import { Queue, QueueStatus } from "@repo/db";

export class QueueRepository extends BaseRepository<"queue"> {
  constructor(prisma: any) {
    super(prisma, "queue");
  }

  async findByStatus(status: QueueStatus): Promise<Queue[]> {
    return super.findMany({
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

  public async hasActiveQueue(): Promise<boolean> {
    const count = await super.count({
      where: {
        status: { in: ["NEW", "PROCESSING"] },
        isDead: false,
      },
    });
    return count > 0;
  }
}
