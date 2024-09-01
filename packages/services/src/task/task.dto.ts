import { IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { TaskType, TaskStatus } from "database";

export class ICreateTaskDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  integrationId: number;

  @IsNotEmpty()
  type: TaskType;
}

export class IGetUserTasksDTO {
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class IStartUserTaskDTO {
  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  userId: string;
}
