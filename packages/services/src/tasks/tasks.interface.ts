import { Task } from "@repo/db";

export interface ITaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findByUserId(userId: string): Promise<Task[]>;
  update(id: string, data: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  toggleComplete(id: string): Promise<Task>;
}

export interface ITaskService {
  createTask(
    userId: string,
    title: string,
    description?: string
  ): Promise<Task>;
  getTask(id: string): Promise<Task>;
  getUserTasks(userId: string): Promise<Task[]>;
  updateTask(id: string, data: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleTaskComplete(id: string): Promise<Task>;
}
