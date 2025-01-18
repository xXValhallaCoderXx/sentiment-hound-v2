import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskType, TaskStatus } from 'database';
import {
  IGetUserTasks,
  ICreateTask,
  IStartUserTask,
} from 'services/src/task/task.interface';

export class ICreateTaskDTO implements ICreateTask {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  integrationId: number;

  @IsNotEmpty()
  type: TaskType;
}

export class IGetUserTasksDTO implements IGetUserTasks {
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class IStartUserTaskDTO implements IStartUserTask {
  @IsNotEmpty()
  taskId: number;

  @IsNotEmpty()
  userId: string;
}
