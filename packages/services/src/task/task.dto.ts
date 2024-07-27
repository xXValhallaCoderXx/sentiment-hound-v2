import { IsNotEmpty } from "class-validator";
import { TaskType } from "database";

export class ICreateTaskDTO {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  type: TaskType;
}
