import { Task, TaskStatus, TaskType } from "@repo/db";

export class TaskRepository {
  private tasks: Task[] = [
    {
      id: 1,
      providerId: 1, // YouTube provider ID
      errorMessage: "Task not found",
      integrationId: 1,
      status: TaskStatus.FAILED,
      type: TaskType.FULL_SYNC,
      userId: "1",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // async findById(id: string): Promise<Task | null> {
  //   return this.tasks.find((task) => task.id === id) || null;
  // }

  async findByUserId(userId: string): Promise<Task[]> {
    return this.tasks.filter((task) => task.userId === userId);
  }

  async create(task: Task): Promise<Task> {
    this.tasks.push(task);
    return task;
  }

  // async update(id: string, data: Partial<Task>): Promise<Task> {
  //   const task = await this.findById(id);
  //   if (!task) throw new Error("Task not found");
  //   Object.assign(task, data);
  //   return task;
  // }

  // async delete(id: string): Promise<void> {
  //   const index = this.tasks.findIndex((task) => task.id === id);
  //   if (index > -1) {
  //     this.tasks.splice(index, 1);
  //   }
  // }

  // async toggleComplete(id: string): Promise<Task> {
  //   const task = await this.findById(id);
  //   if (!task) throw new Error("Task not found");

  //   task.completed = !task.completed;
  //   return task;
  // }

  async getTasks(): Promise<Task[]> {
    return this.tasks;
  }
}
