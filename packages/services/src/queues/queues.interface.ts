export enum QueueStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  DONE = "DONE",
  FAILED = "FAILED",
}

export interface IQueue {
  id: number;
  status: QueueStatus;
  jobId: number;
  payload: any;
  processingAt?: Date;
  isDead: boolean;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQueueRepository {
  create(queue: Partial<IQueue>): Promise<IQueue>;
  findById(id: number): Promise<IQueue | null>;
  findByStatus(status: QueueStatus): Promise<IQueue[]>;
  update(id: number, data: Partial<IQueue>): Promise<IQueue>;
  delete(id: number): Promise<void>;
  incrementAttempts(id: number): Promise<IQueue>;
}

export interface IQueueService {
  createQueue(jobId: number, payload: any): Promise<IQueue>;
  getQueue(id: number): Promise<IQueue>;
  processNext(): Promise<IQueue | null>;
  markAsFailed(id: number, error: string): Promise<IQueue>;
  markAsCompleted(id: number): Promise<IQueue>;
}
