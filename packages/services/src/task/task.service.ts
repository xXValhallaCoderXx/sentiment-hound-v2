import { TaskRepository, taskRepository } from "./task.repository";
import { ICreateTaskDTO } from "./task.dto";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {
    this.taskRepository = taskRepository;
  }
  async createUserTask(data: ICreateTaskDTO) {
    const newTask = await this.taskRepository.createTask(data);

    return newTask;
  }
}

export const taskService = new TaskService(taskRepository);
