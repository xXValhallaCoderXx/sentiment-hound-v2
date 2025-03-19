import { BaseRepository } from "../common/base.repository";
import { JobType, Queue, QueueStatus, TaskType } from "@repo/db";

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

  public async createQueueItem(
    taskId: number,
    taskType: TaskType,
    data?: Record<string, any>
  ): Promise<number> {
    const job = await this.prisma.job.create({
      data: {
        taskId,
        type: JobType.ANALYZE_CONTENT_SENTIMENT, // added job type
        data: {}, // added default empty JSON object for job data
      },
    });
    const queue = await this.prisma.queue.create({
      data: {
        jobId: job.id,
        payload: { taskId, taskType, data },
      },
    });
    return queue.id;
  }

  public async hasActiveQueue(): Promise<boolean> {
    const count = await this.prisma.queue.count({
      where: {
        status: { in: ["NEW", "PROCESSING"] },
        isDead: false,
      },
    });
    return count > 0;
  }
}
