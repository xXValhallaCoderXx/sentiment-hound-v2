import { TaskType } from "@repo/db";

export interface IAddTaskDto {
  providerId?: string;
  integrationId?: string;
  userId: string;
  type: TaskType;
}
