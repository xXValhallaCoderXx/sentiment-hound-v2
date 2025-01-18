import { TaskType, TaskStatus } from "database";

export class ICreateTask {
  userId: string;
  integrationId: number;
  type: TaskType;
}

export class IGetUserTasks {
  userId: string;
  status?: TaskStatus;
}

export class IStartUserTask {
  taskId: number;
  userId: string;
}
