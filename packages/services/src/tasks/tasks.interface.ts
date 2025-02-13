export interface ITask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITaskRepository {
  create(task: Partial<ITask>): Promise<ITask>;
  findById(id: string): Promise<ITask | null>;
  findByUserId(userId: string): Promise<ITask[]>;
  update(id: string, data: Partial<ITask>): Promise<ITask>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<ITask>;
}

export interface ITaskService {
  createTask(
    userId: string,
    title: string,
    description?: string
  ): Promise<ITask>;
  getTask(id: string): Promise<ITask>;
  getUserTasks(userId: string): Promise<ITask[]>;
  updateTask(id: string, data: Partial<ITask>): Promise<ITask>;
  deleteTask(id: string): Promise<void>;
  toggleTaskComplete(id: string): Promise<ITask>;
}
