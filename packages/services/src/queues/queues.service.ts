import { IQueue, IQueueRepository, QueueStatus } from "./queues.interface";

export class CoreQueueService {
  constructor(private repository: IQueueRepository) {}

  async getQueue(id: number): Promise<IQueue> {
    const queue = await this.repository.findById(id);
    if (!queue) {
      throw new Error("Queue not found");
    }
    return queue;
  }

  async processNext(): Promise<IQueue | null> {
    const [nextQueue] = await this.repository.findByStatus(QueueStatus.NEW);
    if (!nextQueue) return null;

    const queue = await this.repository.update(nextQueue.id, {
      status: QueueStatus.PROCESSING,
      processingAt: new Date(),
    });

    return queue;
  }

  async markAsFailed(id: number, error: string): Promise<IQueue> {
    const queue = await this.getQueue(id);
    const attempts = await this.repository.incrementAttempts(id);

    if (attempts.attempts >= attempts.maxAttempts) {
      return this.repository.update(id, {
        status: QueueStatus.FAILED,
        isDead: true,
      });
    }

    return this.repository.update(id, {
      status: QueueStatus.NEW,
    });
  }
}
