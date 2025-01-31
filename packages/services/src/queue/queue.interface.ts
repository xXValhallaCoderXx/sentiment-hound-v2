import { QueueStatus } from "database";

export interface ICreateQueue {
  jobId: number;
  payload: any;
}

export interface IUpdateQueue {
  where: {
    id: number;
  };
  data: {
    status?: QueueStatus;
    processingAt?: Date;
    attempts?: number;
    isDead?: boolean;
    errorMessage?: string;
  };
}
