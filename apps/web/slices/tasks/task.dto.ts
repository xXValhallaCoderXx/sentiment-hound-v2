import { TaskType } from "@repo/db";

export interface IAddTaskDto {
  providerId: string;
  userId: string;
  type: TaskType;
}
